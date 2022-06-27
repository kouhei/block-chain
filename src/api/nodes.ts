import * as express from 'express';
import { blockChain } from '../core/blockChain';

export const router = express.Router();

router.post('/register', (req, res) => {
  const nodes = req.body.nodes as string[];
  if (!nodes) {
    res.status(400).send('invalid nodes');
    return;
  }

  nodes.forEach((node) => blockChain.registerNode(node));

  res.status(201).json({
    message: '新しいノードが追加されました',
    totalNodes: blockChain.nodes.values,
  });
});

// TODO: chain/resolveの方が良くない？
router.get('/resolve', async (_req, res) => {
  const isReplaced = await blockChain.resolveConflicts();
  res.status(200).json({
    message: isReplaced ? 'チェーンが置き換えられました' : 'チェーンが確認されました',
    chain: blockChain.chain,
  });
});

// TODO: コンセンサスアルゴリズムのためのエンドポイント実装の動作確認から
// https://qiita.com/hidehiro98/items/841ece65d896aeaa8a2a#%E3%82%B3%E3%83%B3%E3%82%BB%E3%83%B3%E3%82%B5%E3%82%B9%E3%82%A2%E3%83%AB%E3%82%B4%E3%83%AA%E3%82%BA%E3%83%A0%E3%82%92%E5%AE%9F%E8%A3%85%E3%81%99%E3%82%8B
