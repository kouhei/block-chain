import { createHash } from 'crypto';
import type { ICryptoRepository } from '../Core/Interfaces/Repositories/ICryptoRepository';

export class CryptoRepository implements ICryptoRepository {
  encryptSha256(str: string) {
    const hash = createHash('sha256');
    hash.update(str);
    return hash.digest('hex');
  }
}
