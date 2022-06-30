import type { Block, Proof } from '../../Entities';
import type { IBlockUseCase } from '../../Interfaces/UseCases/IBlockUseCase';
import type { IChainUseCase } from '../../Interfaces/UseCases/IChainUseCase';
import type { IMinerUseCase } from '../../Interfaces/UseCases/IMinerUseCase';
import type { IProofUseCase } from '../../Interfaces/UseCases/IProofUseCase';

export class MinerUseCase implements IMinerUseCase {
  constructor(
    private chainUseCase: IChainUseCase,
    private proofUseCase: IProofUseCase,
    private blockUseCase: IBlockUseCase
  ) {}

  /** @param node_id 採掘者のid */
  mineBlock(node_id: string): Block {
    const newProof = this.calcProofOfWork(this.chainUseCase.lastBlock.proof);
    // sender は採掘者が新しいコインを採掘したことを表すために"0"とする
    this.blockUseCase.addTransaction('0', node_id, 1);
    return this.chainUseCase.addNewBlockToChain(newProof);
  }

  private calcProofOfWork(lastProof: Proof) {
    let proof = 0;
    while (!this.proofUseCase.checkProof(lastProof, proof)) {
      proof++;
    }
    return proof;
  }
}
