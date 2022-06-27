import * as express from 'express';
import { blockChain } from '../core/blockChain';

export const router = express.Router();

router.post('/new', (req, res) => {
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
