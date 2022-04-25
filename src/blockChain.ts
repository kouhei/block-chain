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
    private #chain: Block[];
    private #current_transactions: Transaction[];

    constructor(){
        this.#chain = [];
        this.#current_transactions = [];
    }

    /** 
     * create a new block and add it chain
     * return new block
     */ 
    private addNewBlockToChain(proof: Block["proof"], previousHash: Block["previousHash"] = null):Block{
        const newBlock = new Block(
            this.#chain.length+1,
            Date.now(),
            this.#current_transactions,
            proof,
            previousHash || BlockChain.hash(this.#chain[this.#chain.length - 1])
        );
        this.#current_transactions = [];
        this.#chain.push(newBlock);
        return newBlock;
    }

    /**
     * create a new transaction and add to the list contained in next block.
     * return address of the next block
     */
    private newTransaction(sender: Transaction["sender"], recipient: Transaction["recipient"], amount: Transaction["amount"]):Number{
        this.#current_transactions.push(
            new Transaction(sender, recipient, amount)
        );
        return this.lastBlock.index + 1;
    }

    static hash(block: Block):Hash {
    }

    get lastBlock(): Block {
        return this.#chain[this.#chain.length - 1];
    }
}