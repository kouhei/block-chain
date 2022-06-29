import { Block, Chain, IChain, Proof } from '../../entities';
import { INodeDriver } from '../../interfaces/drivers/INodeDriver';
import { IBlockUseCase } from '../../interfaces/useCases/IBlockUseCase';
import { IChainUseCase } from '../../interfaces/useCases/IChainUseCase';
import { IProofUseCase } from '../../interfaces/useCases/IProofUseCase';

export class ChainUseCase implements IChainUseCase {
  private nodeRepository: INodeDriver;
  private blockUseCase: IBlockUseCase;
  private proofUseCase: IProofUseCase;
  chain: IChain;

  constructor(nodeRepository: INodeDriver, blockUseCase: IBlockUseCase, proofUseCase: IProofUseCase) {
    this.nodeRepository = nodeRepository;
    // ジェネシスブロックを作る
    const index = 1;
    const newBlock = new Block(index, new Date('2022-06-27T03:54:00.000Z').getTime(), [], 100, '1');
    this.chain = new Chain([newBlock]);

    this.blockUseCase = blockUseCase;
    this.proofUseCase = proofUseCase;
  }

  get lastBlock(): Block {
    return (this.chain.get(this.chain.size) || this.chain.get(1)) as Block;
  }

  /** ブロックチェーンが正しいかを確認する */
  validChain(chain: IChain): boolean {
    let current_index = 1;
    let lastBlock = chain.get(current_index) as Block;

    while (current_index <= chain.size) {
      const block = chain.get(current_index);

      if (!block) {
        return false;
      }

      if (block.index === 1) {
        lastBlock = block;
        current_index++;
        continue;
      }

      // ハッシュと proof of work の確認
      const hasCorrectHash = block.previousHash === this.blockUseCase.generateBlockHash(lastBlock);
      const isCorrectProof = this.proofUseCase.checkProof(lastBlock.proof, block.proof);
      if (!hasCorrectHash || !isCorrectProof) {
        console.debug('invalid chain', hasCorrectHash, isCorrectProof);
        return false;
      }

      lastBlock = block;
      current_index++;
    }
    return true;
  }

  /**
   * create a new block and add it chain
   * @param proof 新しいブロックの proof of work
   * @param previousHash 一つ前のハッシュ値。与えられなかった場合は現在の最新のブロックのハッシュを使う。
   * @return new block
   */
  addNewBlockToChain(proof: Proof): Block {
    const newBlock = this.blockUseCase.createNewBlock(proof, this.lastBlock);
    this.chain = new Chain([...Object.values(this.chain.toObject()), newBlock]);
    return newBlock;
  }

  /** コンセンサスアルゴリズム。自分のチェーンをネットワーク上の最も長いチェーンに置き換えコンフリクトを解消する
   * @return 自分のチェーンが置き換えられたかどうか
   */
  async resolveConflicts(addresses: string[]): Promise<boolean> {
    let newChain: IChain | null = null;
    let maxLength = this.chain.size;

    for (const address of addresses) {
      try {
        const data = await this.nodeRepository.getChain(`${address}/chain`);

        // if (res.status !== 200) {
        //   console.warn(`node(${address}): status is ${res.status}`);
        //   continue;
        // }
        if (!data?.length || !data?.chain) {
          console.warn(`node(${address}): invalid length or chain`);
          continue;
        }

        const length = data.length;
        const chain = new Chain(Object.values(data.chain));

        // 自身のチェーンより長くて有効なチェーンがあったらそれで置き換える
        if (length > maxLength && this.validChain(chain)) {
          console.debug('replaced chain by', address);
          maxLength = length;
          newChain = chain;
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (newChain) {
      this.replaceChain(newChain);
      return true;
    }

    return false;
  }

  private replaceChain(newChain: IChain) {
    this.chain = newChain;
  }
}
