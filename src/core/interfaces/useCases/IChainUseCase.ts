import type { Block, IChain, Proof } from '../../Entities';

export interface IChainUseCase {
  chain: IChain;
  lastBlock: Block;
  validChain(chain: IChain): boolean;
  addNewBlockToChain(proof: Proof): Block;
  resolveConflicts(addresses: string[]): Promise<boolean>;
}
