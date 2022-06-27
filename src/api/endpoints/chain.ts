import * as express from 'express';
import { chainService } from '../../core/application/services/chainService';

export const router = express.Router();

router.get('/', (_req, res) => {
  const chain = chainService.toObject();
  const body = {
    chain,
    length: Object.keys(chain).length,
  };
  res.send(body);
});
