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
    chain: Map<Index,Block>;
    private current_transactions: Transaction[];

    constructor(){
        this.chain = new Map();
        this.current_transactions = [];
    }

    /**
     * create a new block and add it chain
     * return new block
     */
    addNewBlockToChain(proof: Block["proof"], previousHash: Block["previousHash"] = null):Block{
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
    createNewTransaction(sender: Transaction["sender"], recipient: Transaction["recipient"], amount: Transaction["amount"]):Number{
        this.current_transactions.push(
            new Transaction(sender, recipient, amount)
        );
        return this.lastBlock.index + 1;
    }

    static generateHash(block: Block):Hash {
        const blockMap = new Map(Object.entries(block));
        const jsonStr = JSON.stringify(Array.from(blockMap));
        return encryptSha256(jsonStr);
    }

    get lastBlock(): Block {
        return this.chain.get(this.chain.size - 1);
    }

    calcProofOfWork(lastProof: Proof){
        let proof = 0;
        while(!this.checkProof(lastProof, proof)){
            proof++;
        }
        return proof;
    }

    /**
     * last_proofとproofのハッシュを計算し、最初の４つが0か確認する
    */
    checkProof(lastProof:Proof, proof:Proof){
        const guess = `${lastProof}${proof}`;
        const guessHash = encryptSha256(guess);
        return guessHash.slice(-4) === "0000";
    }

    /* TODO: ここから
    https://qiita.com/hidehiro98/items/841ece65d896aeaa8a2a#%E3%82%B9%E3%83%86%E3%83%83%E3%83%972-api%E3%81%A8%E3%81%97%E3%81%A6%E3%81%AE%E7%A7%81%E3%81%9F%E3%81%A1%E3%81%AE%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%E3%83%81%E3%82%A7%E3%83%BC%E3%83%B3
    */
}

function encryptSha256(str: string){
    const hash = createHash('sha256');
    hash.update(str);
    return hash.digest('hex')
}