import { createHash } from 'crypto';
import { default as axios } from 'axios';

type Uuid = string;
type Amount = number;
class Transaction {
  constructor(public sender: Uuid, public recipient: Uuid, public amount: Amount) {}
}

type Proof = number;
type Hash = string;
type TimeStamp = number;
type Index = number;
class Block {
  constructor(
    public index: Index,
    public timestamp: TimeStamp,
    public transactions: Transaction[],
    public proof: Proof,
    public previousHash: Hash
  ) {}
}

type NodeAddress = string;

class BlockChain {
  /** ブロックチェーンのデータを格納するところ */
  chain: Map<Index, Block>;

  /** ネットワーク上のノードリスト */
  nodes: Set<NodeAddress>; // TODO: example.com みたいな形式を想定。プロトコルやパスがついてても問題なく動くようにする

  /** ブロックとして追加されていないトランザクション */
  private current_transactions: Transaction[];

  constructor() {
    this.chain = new Map();
    this.nodes = new Set();
    this.current_transactions = [];
    // ジェネシスブロックを作る
    this.addNewBlockToChain(100, '1');
  }

  /**
   * create a new block and add it chain
   * @param proof 新しいブロックのproof of work
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
   * @return address of the next block
   */
  createNewTransaction(
    sender: Transaction['sender'],
    recipient: Transaction['recipient'],
    amount: Transaction['amount']
  ): Number {
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

  calcProofOfWork(lastProof: Proof) {
    let proof = 0;
    while (!this.checkProof(lastProof, proof)) {
      proof++;
    }
    return proof;
  }

  /**
   * lastProofとproofのハッシュを計算し、最初の４つが0か確認する
   */
  checkProof(lastProof: Proof, proof: Proof) {
    const NUMBER = 4;
    const guess = `${lastProof}${proof}`;
    const guessHash = encryptSha256(guess);
    return guessHash.slice(-1 * NUMBER) === ''.padStart(NUMBER, '0');
  }

  /** ノードリストに新しいノードを追加する
   * @param address ノードのアドレス
   */
  registerNode(address: NodeAddress) {
    this.nodes.add(address);
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

      // ハッシュと proof of work の確認
      const hasCorrectHash = block?.previousHash === this.generateBlockHash(lastBlock);
      const isCorrectProof = this.checkProof(lastBlock.proof, block.proof);
      if (!hasCorrectHash || !isCorrectProof) {
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
      if (res.status === 200) {
        length = res.data.length;
        const chain = res.data.chain;
        // 自身のチェーンより長くて有効なチェーンがあったらそれで置き換える
        if (length > length && this.validChain(chain)) {
          maxLength = length;
          newChain = chain;
        }
      }
    }

    if (newChain) {
      this.chain = newChain;
      return true;
    }

    return false;
  }
}

function encryptSha256(str: string) {
  const hash = createHash('sha256');
  hash.update(str);
  return hash.digest('hex');
}

export const blockChain = new BlockChain();
