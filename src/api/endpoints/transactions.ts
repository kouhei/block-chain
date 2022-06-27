import * as express from 'express';
import { createNewTransaction } from '../../core/application/useCases/createNewTransactionUseCase';

export const router = express.Router();

router.post('/new', (req, res) => {
  const sender = req.body?.sender;
  const recipient = req.body?.recipient;
  const amount = Number.parseInt(req.body?.amount);

  if (!sender || !recipient || !amount) {
    res.status(400).send('sender, resipient and amount is necessary');
    return;
  }

  const blockId = createNewTransaction(sender as string, recipient as string, amount);

  res.status(201).json({
    blockId,
    message: `トランザクションはブロック ${blockId} に追加されました`,
  });
});
