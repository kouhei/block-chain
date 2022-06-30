import * as express from 'express';
import type { IBlockUseCase } from '../../Core/Interfaces/UseCases/IBlockUseCase';
import type { IChainUseCase } from '../../Core/Interfaces/UseCases/IChainUseCase';

export const transactions = (blockUseCase: IBlockUseCase, chainUseCase: IChainUseCase) => {
  const router = express.Router();

  router.post('/new', (req, res) => {
    const sender = req.body?.sender as string;
    const recipient = req.body?.recipient as string;
    const amount = Number.parseInt(req.body?.amount);

    if (!sender || !recipient || !amount) {
      res.status(400).send('sender, resipient and amount is necessary');
      return;
    }

    blockUseCase.addTransaction(sender, recipient, amount);
    const blockId = chainUseCase.lastBlock.index + 1;

    res.status(201).json({
      blockId,
      message: `トランザクションはブロック ${blockId} に追加されました`,
    });
  });

  return router;
};
