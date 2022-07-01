import type { Proof } from '../../Entities';

export interface IProofUseCase {
  checkProof(lastProof: Proof, proof: Proof): boolean;
}
