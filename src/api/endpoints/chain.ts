import * as express from 'express';
import { blockChain } from '../../core/application/services/blockChain';

export const router = express.Router();

router.get('/', (_req, res) => {
  const chain = blockChain.chain;
  const body = {
    chain,
    length: Object.keys(chain).length,
  };
  res.send(body);
});
