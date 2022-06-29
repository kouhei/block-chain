import { Proof } from '../../entities';

export interface IProofUseCase {
  checkProof(lastProof: Proof, proof: Proof): boolean;
}
