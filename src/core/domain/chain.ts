import { Block, Index } from './block';

/** ブロックチェーンのデータを格納するところ */
export interface IChain {
  set(block: Block): void;
  get(index: Index): Block | undefined;
  getSize(): number;
  lastBlock(): Block | undefined;
  toObject(): { [index: string]: Block };
  fromObject(obj: { [index: string]: Block }): void;
}

export class Chain implements IChain {
  private _chain: Map<Index, Block>;

  constructor() {
    this._chain = new Map();
  }

  set(block: Block) {
    const key = block.index;
    this._chain.set(key, block);
  }

  get(index: Index) {
    return this._chain.get(index);
  }

  getSize() {
    return this._chain.size;
  }

  lastBlock() {
    return this._chain.get(this._chain.size) as Block;
  }

  toObject() {
    return Object.fromEntries(this._chain.entries());
  }

  fromObject(obj: { [index: string]: Block }) {
    this._chain = new Map(Object.entries(obj).map(([key, value]) => [Number.parseInt(key), value]));
  }
}
