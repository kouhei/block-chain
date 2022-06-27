import { default as axios } from 'axios';
import { Block } from '../../domain/block';
import { Chain, IChain } from '../../domain/chain';
import { Proof } from '../../domain/types';
import { checkProof } from '../../domain/utils/util';
import { blockService } from './blockService';

class ChainService {
  constructor(private chain: IChain) {
    // ジェネシスブロックを作る
    const index = 1;
    const newBlock = new Block(index, new Date('2022-06-27T03:54:00.000Z').getTime(), [], 100, '1');
    this.chain.set(newBlock);
  }

  getLastBlock(): Block {
    return this.chain.lastBlock() as Block;
  }

  getSize(): number {
    return this.chain.getSize();
  }

  set(block: Block): void {
    this.chain.set(block);
  }

  toObject(): { [index: string]: Block } {
    return this.chain.toObject();
  }

  // TODO: 別にした方がいいかも
  /** ブロックチェーンが正しいかを確認する */
  validChain(chain: IChain): boolean {
    let current_index = 1;
    let lastBlock = chain.get(current_index) as Block;

    while (current_index <= chain.getSize()) {
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
      const hasCorrectHash = block.previousHash === blockService.generateBlockHash(lastBlock);
      const isCorrectProof = checkProof(lastBlock.proof, block.proof);
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
    const newBlock = blockService.createNewBlock(proof, chainService.getLastBlock());
    this.set(newBlock);
    return newBlock;
  }

  /** コンセンサスアルゴリズム。自分のチェーンをネットワーク上の最も長いチェーンに置き換えコンフリクトを解消する
   * @return 自分のチェーンが置き換えられたかどうか
   */
  async resolveConflicts(addresses: string[]): Promise<boolean> {
    let newChain: IChain | null = null;
    let maxLength = chainService.getSize();

    for (const address of addresses) {
      try {
        const res = await axios.get(`${address}/chain`);

        if (res.status !== 200) {
          console.warn(`node(${address}): status is ${res.status}`);
          continue;
        }
        if (!Number.parseInt(res.data?.length) || !res.data?.chain) {
          console.warn(`node(${address}): invalid length or chain`);
          continue;
        }

        const length = Number.parseInt(res.data.length);
        const chain = new Chain();
        chain.fromObject(res.data.chain);

        // 自身のチェーンより長くて有効なチェーンがあったらそれで置き換える
        if (length > maxLength && chainService.validChain(chain)) {
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

export const chainService = new ChainService(new Chain());
