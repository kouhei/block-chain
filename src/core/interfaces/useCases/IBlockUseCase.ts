import type { Amount, Block, Hash, Proof, Uuid } from '../../entities';

export interface IBlockUseCase {
  addTransaction(sender: Uuid, recipient: Uuid, amount: Amount): void;
  createNewBlock(proof: Proof, lastBlock: Block): Block;
  generateBlockHash(block: Block): Hash;
}
