import * as express from 'express';
import type { IMinerUseCase } from '../../Core/Interfaces/UseCases/IMinerUseCase';

export const mine = (minerUseCase: IMinerUseCase, node_id: string) => {
  return express.Router().get('/', (_req, res) => {
    const { index, transactions, proof, previousHash } = minerUseCase.mineBlock(node_id);

    res.status(200).json({
      message: '新しいブロックを採掘しました',
      index,
      transactions,
      proof,
      previousHash,
    });
  });
};
