import { Amount, Uuid } from '../../entities';

export interface ITransactionUseCase {
  /**
   * create a new transaction and add to the list contained in next block.
   * @param sender 送信者
   * @param recipient 受信者
   * @param amount 送った数量
   * @return address of new block contains created transacition
   */
  createNewTransaction(sender: Uuid, recipient: Uuid, amount: Amount): number;
}
