import {createHash} from "crypto";

type Uuid = string;
type Amount = number;
class Transaction{
    constructor(
        public sender: Uuid,
        public recipient: Uuid,
        public amount: Amount
    ){}
}

type Proof = number;
type Hash = string;
type TimeStamp = number;
type Index = number;
class Block{
    constructor(
        public index: Index,
        public timestamp: TimeStamp,
        public transactions: Transaction[],
        public proof: Proof,
        public previousHash: Hash
    ){}
}

class BlockChain{
    private chain: Map<Index,Block>;
    private current_transactions: Transaction[];

    constructor(){
        this.chain = new Map();
        this.current_transactions = [];
    }

    /**
     * create a new block and add it chain
     * return new block
     */
    private addNewBlockToChain(proof: Block["proof"], previousHash: Block["previousHash"] = null):Block{
        const index = this.chain.size + 1;
        const newBlock = new Block(
            index,
            Date.now(),
            this.current_transactions,
            proof,
            previousHash || BlockChain.generateHash(this.chain.get(this.chain.size - 1))
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
    private newTransaction(sender: Transaction["sender"], recipient: Transaction["recipient"], amount: Transaction["amount"]):Number{
        this.current_transactions.push(
            new Transaction(sender, recipient, amount)
        );
        return this.lastBlock.index + 1;
    }

    static generateHash(block: Block):Hash {
        const blockMap = new Map(Object.entries(block));
        const jsonStr = JSON.stringify(Array.from(blockMap));
        const hash = createHash('sha256');
        hash.update(jsonStr);
        return hash.digest('hex')
    }

    get lastBlock(): Block {
        return this.chain.get(this.chain.size - 1);
    }

    /* TODO: ここから
    https://qiita.com/hidehiro98/items/841ece65d896aeaa8a2a#%E3%83%97%E3%83%AB%E3%83%BC%E3%83%95%E3%82%AA%E3%83%96%E3%83%AF%E3%83%BC%E3%82%AF%E3%82%92%E7%90%86%E8%A7%A3%E3%81%99%E3%82%8B
    */
}