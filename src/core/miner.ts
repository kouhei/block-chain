import { Proof } from '../models/types';
import { checkProof, encryptSha256 } from '../utils/util';

export class Miner {
  calcProofOfWork(lastProof: Proof) {
    let proof = 0;
    while (!checkProof(lastProof, proof)) {
      proof++;
    }
    return proof;
  }
}
