import * as express from 'express';
import { IChainUseCase } from '../../core/interfaces/useCases/IChainUseCase';

export const chain = (chainUseCase: IChainUseCase) => {
  return express.Router().get('/', (_req, res) => {
    const chain = chainUseCase.chain.toObject();
    const body = {
      chain,
      length: Object.keys(chain).length,
    };
    res.send(body);
  });
};
