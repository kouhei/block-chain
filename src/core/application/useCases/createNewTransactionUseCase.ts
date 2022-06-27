import type { Amount, Uuid } from '../../domain/transaction';
import { blockService } from '../services/blockService';
import { chainService } from '../services/chainService';

/**
 * create a new transaction and add to the list contained in next block.
 * @param sender 送信者
 * @param recipient 受信者
 * @param amount 送った数量
 * @return address of new block contains created transacition
 */
export function createNewTransaction(sender: Uuid, recipient: Uuid, amount: Amount): number {
  blockService.addTransaction(sender, recipient, amount);
  return chainService.getLastBlock().index + 1;
}
