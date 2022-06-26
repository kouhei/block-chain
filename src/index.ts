import {blockChain} from "./blockChain"

// add new transaction
const index = blockChain.createNewTransaction("alice", "bob", 5);
console.log(`トランザクションはブロック ${index} に追加されました`);

mine();
getChain();

mine();
getChain();

function mine(){
    const proof = blockChain.calcProofOfWork(blockChain.lastBlock.proof);
    blockChain.createNewTransaction("0","kouhei",1);
    const block = blockChain.addNewBlockToChain(proof);
    console.log(`
    新しいブロックを採掘しました
    index: ${block.index},
    transactions: ${JSON.stringify(block.transactions)},
    proof: ${block.proof},
    previous_hash: ${block.previousHash},
    `);
}

function getChain(){
    console.info(`
    chain: ${JSON.stringify(Array.from(blockChain.chain))},
    length: ${blockChain.chain.size},
    `);
}