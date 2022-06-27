import { node_id } from '../../../api/util';
import { Block } from '../../domain/block';
import { Miner } from '../../domain/miner';
import { chainService } from '../services/chainService';
import { createNewTransaction } from './createNewTransactionUseCase';

const miner = new Miner();

export function mineBlock(): Block {
  const newProof = miner.calcProofOfWork(chainService.getLastBlock().proof);
  // sender は採掘者が新しいコインを採掘したことを表すために"0"とする
  createNewTransaction('0', node_id, 1);
  return chainService.addNewBlockToChain(newProof);
}
