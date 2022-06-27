import * as express from 'express';
import { chainService } from '../../core/application/services/chainService';
import { nodeService } from '../../core/application/services/nodeService';
import { NodeAddress } from '../../core/domain/node';

export const router = express.Router();

router.post('/register', (req, res) => {
  const nodeAddresses = req.body.nodes as NodeAddress[];
  if (!nodeAddresses) {
    res.status(400).send('invalid nodes');
    return;
  }

  const totalNodes = nodeService.addNodes(nodeAddresses);

  res.status(201).json({
    message: '新しいノードが追加されました',
    totalNodes,
  });
});

// TODO: chain/resolveの方が良くない？
router.get('/resolve', async (_req, res) => {
  const addresses = Array.from(nodeService.getNodes().values()).map((node) => node.address);
  const isReplaced = await chainService.resolveConflicts(addresses);

  res.status(200).json({
    message: isReplaced ? 'チェーンが置き換えられました' : 'チェーンが確認されました',
    chain: chainService.toObject(),
  });
});
