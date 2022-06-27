import * as express from 'express';
import { blockChain } from '../core/blockChain';
import { Miner } from '../core/miner';
import { node_id } from './util';

const miner = new Miner();

export const router = express.Router();

router.get('/', (_req, res) => {
  const newProof = miner.calcProofOfWork(blockChain.lastBlock.proof);
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
