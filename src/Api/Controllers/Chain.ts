import * as express from 'express';
import type { IChainUseCase } from '../../Core/Interfaces/UseCases/IChainUseCase';

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
