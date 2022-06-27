import * as express from 'express';
import { mineBlock } from '../../core/application/useCases/mineBlockUseCase';

export const router = express.Router();

router.get('/', (_req, res) => {
  const { index, transactions, proof, previousHash } = mineBlock();

  res.status(200).json({
    message: '新しいブロックを採掘しました',
    index,
    transactions,
    proof,
    previousHash,
  });
});
