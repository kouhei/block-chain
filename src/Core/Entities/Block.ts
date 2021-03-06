import type { Proof } from './Proof';
import type { Transaction } from './Transaction';

export type Hash = string;
export type TimeStamp = number;
export type Index = number;

export class Block {
  constructor(
    public index: Index,
    public timestamp: TimeStamp,
    public transactions: Transaction[],
    public proof: Proof,
    public previousHash: Hash
  ) {}
}
