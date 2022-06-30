import type { Proof } from '../Entities';
import type { ICryptoRepository } from '../Interfaces/ICryptoRepository';
import type { IProofUseCase } from '../Interfaces/UseCases/IProofUseCase';

export class ProofUseCase implements IProofUseCase {
  constructor(private cryptoRepository: ICryptoRepository) {}

  /** lastProofとproofのハッシュを計算し、最初の４つが0か確認する */
  checkProof(lastProof: Proof, proof: Proof): boolean {
    const NUMBER = 4;
    const guess = `${lastProof}${proof}`;
    const guessHash = this.cryptoRepository.encryptSha256(guess);
    return guessHash.slice(-1 * NUMBER) === ''.padStart(NUMBER, '0');
  }
}
