import { default as axios } from 'axios';
import { Block, Hash, Index, NodeAddress, Transaction } from '../models/types';
import { checkProof, encryptSha256 } from './utils/util';

class BlockChain {
  /** ブロックチェーンのデータを格納するところ */
  chain: Map<Index, Block>;

  /** ネットワーク上のノードリスト */
  nodes: Set<NodeAddress>; // TODO: http://example.com みたいな形式を想定。プロトコルやパスがついてても問題なく動くようにする

  /** ブロックとして追加されていないトランザクション */
  private current_transactions: Transaction[];

  constructor() {
    this.chain = new Map();
    this.nodes = new Set();
    this.current_transactions = [];
    // ジェネシスブロックを作る
    const index = 1;
    const newBlock = new Block(index, new Date('2022-06-27T03:54:00.000Z').getTime(), [], 100, '1');
    this.chain.set(index, newBlock);
  }

  /**
   * create a new block and add it chain
   * @param proof 新しいブロックの proof of work
   * @param previousHash 一つ前のハッシュ値。与えられなかった場合は現在の最新のブロックのハッシュを使う。
   * @return new block
   */
  addNewBlockToChain(proof: Block['proof'], previousHash: Block['previousHash'] = ''): Block {
    const index = this.chain.size + 1;
    const newBlock = new Block(
      index,
      Date.now(),
      this.current_transactions,
      proof,
      previousHash || this.generateBlockHash(this.chain.get(this.chain.size) as Block)
    );
    this.current_transactions = [];
    this.chain.set(index, newBlock);
    return newBlock;
  }

  /**
   * create a new transaction and add to the list contained in next block.
   * @param sender 送信者
   * @param recipient 受信者
   * @param amount 送った数量
   * @return address of new block contains created transacition
   */
  createNewTransaction(
    sender: Transaction['sender'],
    recipient: Transaction['recipient'],
    amount: Transaction['amount']
  ): number {
    this.current_transactions.push(new Transaction(sender, recipient, amount));
    return this.lastBlock.index + 1;
  }

  generateBlockHash(block: Block): Hash {
    const { index, timestamp, transactions, proof, previousHash } = block;
    const blockMap = new Map(Object.entries({ index, timestamp, transactions, proof, previousHash }));
    const jsonStr = JSON.stringify(Array.from(blockMap));
    return encryptSha256(jsonStr);
  }

  get lastBlock(): Block {
    return this.chain.get(this.chain.size) as Block;
  }

  /** ノードリストに新しいノードを追加する
   * @param address ノードのアドレス
   */
  registerNode(address: NodeAddress) {
    this.nodes.add(address);
    console.debug('added node:', address);
  }

  /** ブロックチェーンが正しいかを確認する */
  validChain(chain: BlockChain['chain']) {
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
      const hasCorrectHash = block.previousHash === this.generateBlockHash(lastBlock);
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

  /** コンセンサスアルゴリズム。自分のチェーンをネットワーク上の最も長いチェーンに置き換えコンフリクトを解消する
   * @return 自分のチェーンが置き換えられたかどうか
   */
  async resolveConflicts() {
    const neighbours = this.nodes;
    let newChain: BlockChain['chain'] | null = null;
    let maxLength = this.chain.size;

    for (const node of neighbours) {
      const res = await axios.get(`${node}/chain`);

      if (res.status !== 200) {
        console.warn(`node(${node}): status is ${res.status}`);
        continue;
      }
      if (!Number.parseInt(res.data?.length) || !res.data?.chain) {
        console.warn(`node(${node}): invalid length or chain`);
        continue;
      }

      const length = Number.parseInt(res.data.length);
      const chain = new Map(
        Object.entries(res.data.chain).map(([key, value]) => [Number.parseInt(key), value])
      ) as BlockChain['chain'];

      // 自身のチェーンより長くて有効なチェーンがあったらそれで置き換える
      if (length > maxLength && this.validChain(chain)) {
        console.debug('replaced chain by', node);
        maxLength = length;
        newChain = chain;
      }
    }

    if (newChain) {
      this.chain = newChain;
      return true;
    }

    return false;
  }
}

export const blockChain = new BlockChain();
