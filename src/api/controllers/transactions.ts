import * as express from 'express';
import type { IBlockUseCase } from '../../core/interfaces/useCases/IBlockUseCase';
import type { IChainUseCase } from '../../core/interfaces/useCases/IChainUseCase';

export const transactions = (blockUseCase: IBlockUseCase, chainUseCase: IChainUseCase) => {
  const router = express.Router();

  router.post('/new', (req, res) => {
    const sender = req.body?.sender;
    const recipient = req.body?.recipient;
    const amount = Number.parseInt(req.body?.amount);

    if (!sender || !recipient || !amount) {
      res.status(400).send('sender, resipient and amount is necessary');
      return;
    }

    blockUseCase.addTransaction(sender as string, recipient as string, amount);
    const blockId = chainUseCase.lastBlock.index + 1;

    res.status(201).json({
      blockId,
      message: `トランザクションはブロック ${blockId} に追加されました`,
    });
  });

  return router;
};
