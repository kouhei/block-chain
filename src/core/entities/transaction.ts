export type Uuid = string;
export type Amount = number;

export class Transaction {
  constructor(public sender: Uuid, public recipient: Uuid, public amount: Amount) {}
}

export interface ITransactions {
  getTransactions(): Transaction[];
  add(t: Transaction): void;
}

export class Transactions implements ITransactions {
  private _transactions: Transaction[] = [];

  getTransactions() {
    return this._transactions;
  }

  add(transaction: Transaction) {
    this._transactions.push(transaction);
  }
}
