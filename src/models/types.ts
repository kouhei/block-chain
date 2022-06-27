export type Uuid = string;
export type Amount = number;
export class Transaction {
  constructor(public sender: Uuid, public recipient: Uuid, public amount: Amount) {}
}

export type Proof = number;
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

export type NodeAddress = string;
