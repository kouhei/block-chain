import { createHash } from 'crypto';
import { ICryptoRepository } from '../interfaces/ICryptoRepository';

export class CryptoRepository implements ICryptoRepository {
  encryptSha256(str: string) {
    const hash = createHash('sha256');
    hash.update(str);
    return hash.digest('hex');
  }
}
