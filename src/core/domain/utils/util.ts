import { createHash } from 'crypto';
import { Proof } from '../types';

export function encryptSha256(str: string) {
  const hash = createHash('sha256');
  hash.update(str);
  return hash.digest('hex');
}

/**
 * lastProofとproofのハッシュを計算し、最初の４つが0か確認する
 */
export function checkProof(lastProof: Proof, proof: Proof) {
  const NUMBER = 4;
  const guess = `${lastProof}${proof}`;
  const guessHash = encryptSha256(guess);
  return guessHash.slice(-1 * NUMBER) === ''.padStart(NUMBER, '0');
}
