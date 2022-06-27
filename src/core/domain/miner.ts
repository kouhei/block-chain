import { checkProof } from '../utils/util';
import { Proof } from './types';

export class Miner {
  calcProofOfWork(lastProof: Proof) {
    let proof = 0;
    while (!checkProof(lastProof, proof)) {
      proof++;
    }
    return proof;
  }
}
