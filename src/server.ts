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

app.post('/nodes/register', (req, res) => {
  const nodes = req.body.nodes as string[]; // TODO: 要素が一つだけの時にstringとstring[]を区別
  if (!nodes) {
    res.status(400).send('invalid nodes');
  }

  nodes.forEach((node) => blockChain.registerNode(node));

  res.status(201).json({
    message: '新しいノードが追加されました',
    totalNodes: blockChain.nodes.values,
  });
});

app.get('/nodes/resolve', async (req, res) => {
  const isReplaced = await blockChain.resolveConflicts();
  res.status(200).json({
    message: isReplaced ? 'チェーンが置き換えられました' : 'チェーンが確認されました',
    chain: blockChain.chain,
  });
});

// TODO: コンセンサスアルゴリズムのためのエンドポイント実装の動作確認から
// https://qiita.com/hidehiro98/items/841ece65d896aeaa8a2a#%E3%82%B3%E3%83%B3%E3%82%BB%E3%83%B3%E3%82%B5%E3%82%B9%E3%82%A2%E3%83%AB%E3%82%B4%E3%83%AA%E3%82%BA%E3%83%A0%E3%82%92%E5%AE%9F%E8%A3%85%E3%81%99%E3%82%8B

const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
