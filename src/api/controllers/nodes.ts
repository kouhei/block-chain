import * as express from 'express';
import type { NodeAddress } from '../../Core/Entities';
import type { IChainUseCase } from '../../Core/Interfaces/UseCases/IChainUseCase';
import type { INodeUseCase } from '../../Core/Interfaces/UseCases/INodeUseCase';

export const nodes = (nodeUseCase: INodeUseCase, chainUseCase: IChainUseCase) => {
  const router = express.Router();

  router.post('/register', (req, res) => {
    const nodeAddresses = req.body.nodes as NodeAddress[];
    if (!nodeAddresses) {
      res.status(400).send('invalid nodes');
      return;
    }

    nodeUseCase.addNodes(nodeAddresses);
    const totalNodes = Array.from(nodeUseCase.getNodes().values()).map((node) => node.address);

    res.status(201).json({
      message: '新しいノードが追加されました',
      totalNodes,
    });
  });

  router.get('/resolve', async (_req, res) => {
    const addresses = Array.from(nodeUseCase.getNodes().values()).map((node) => node.address);
    const isReplaced = await chainUseCase.resolveConflicts(addresses);

    res.status(200).json({
      message: isReplaced ? 'チェーンが置き換えられました' : 'チェーンが確認されました',
      chain: chainUseCase.chain.toObject(),
    });
  });

  return router;
};
