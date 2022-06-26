import { createHash } from 'crypto';

type Uuid = string;
type Amount = number;
class Transaction {
  constructor(public sender: Uuid, public recipient: Uuid, public amount: Amount) { }
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
  ) { }
}

class BlockChain {
  chain: Map<Index, Block>;
  private current_transactions: Transaction[];

  constructor() {
    this.chain = new Map();
    this.current_transactions = [];
    // ジェネシスブロックを作る
    this.addNewBlockToChain(100, '1');
  }

  /**
   * create a new block and add it chain
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
   * TODO: かく
   * @param sender
   * @param recipient
   * @param amount
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
}

function encryptSha256(str: string) {
  const hash = createHash('sha256');
  hash.update(str);
  return hash.digest('hex');
}

export const blockChain = new BlockChain();
