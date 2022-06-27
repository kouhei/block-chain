import { Transaction } from './transaction';
import { Proof } from './types';

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
