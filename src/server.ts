import * as express from 'express';
import * as bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import { blockChain } from './blockChain';

const node_id = uuidv4();

const app = express();

// post で body を json で受け取れるようにする
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/transactions/new', (req, res) => {
  const sender = req.body?.sender;
  const recipient = req.body?.recipient;
  const amount = Number.parseInt(req.body?.amount);

  if (!sender || !recipient || !amount) {
    res.status(400).send('sender, resipient and amount is necessary');
    return;
  }
  const blockId = blockChain.createNewTransaction(sender as string, recipient as string, amount);

  res.status(201).json({
    blockId,
    message: `トランザクションはブロック ${blockId} に追加されました`,
  });
});

app.get('/mine', (_req, res) => {
  const newProof = blockChain.calcProofOfWork(blockChain.lastBlock.proof);
  // sender は採掘者が新しいコインを採掘したことを表すために"0"とする
  blockChain.createNewTransaction('0', node_id, 1);
  const { index, transactions, proof, previousHash } = blockChain.addNewBlockToChain(newProof);

  res.status(200).json({
    message: '新しいブロックを採掘しました',
    index,
    transactions,
    proof,
    previousHash,
  });
});

app.get('/chain', (_req, res) => {
  const chain = blockChain.chain;
  const body = {
    chain: Object.fromEntries(blockChain.chain.entries()),
    length: chain.size,
  };
  res.send(body);
});

// TODO: コンセンサスアルゴリズムのためのエンドポイント実装
// https://qiita.com/hidehiro98/items/841ece65d896aeaa8a2a#%E6%96%B0%E3%81%97%E3%81%84%E3%83%8E%E3%83%BC%E3%83%89%E3%82%92%E7%99%BB%E9%8C%B2%E3%81%99%E3%82%8B

const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
