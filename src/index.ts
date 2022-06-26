import { blockChain } from './blockChain';

// TODO: api化

console.log('initial chain');
getChain();

// add new transaction
const index = blockChain.createNewTransaction('alice', 'bob', 5);
console.log(`トランザクションはブロック ${index} に追加されました
`);

mine();

mine();

function mine() {
  const proof = blockChain.calcProofOfWork(blockChain.lastBlock.proof);
  blockChain.createNewTransaction('0', 'kouhei', 1);
  const block = blockChain.addNewBlockToChain(proof);
  console.log(`新しいブロックを採掘しました
    index: ${block.index},
    transactions: ${JSON.stringify(block.transactions)},
    proof: ${block.proof},
    previous_hash: ${block.previousHash},
    `);
  getChain();
}

function getChain() {
  const lastBlockHash = blockChain.generateBlockHash(blockChain.chain.get(blockChain.chain.size) as any);
  console.log(`chain:
    ${JSON.stringify(Object.fromEntries(blockChain.chain.entries()), null, 2)},
length: ${blockChain.chain.size},
lastBlockHash: ${lastBlockHash}
    `);
}
