import type { Block, Index } from './block';

/** ブロックチェーンのデータを格納するところ */
export interface IChain {
  size: number;
  get(index: Index): Block | undefined;
  toObject(): { [index: string]: Block };
}

export class Chain implements IChain {
  private _chain: Map<Index, Block>;
  size: number = 0;

  constructor(blocks: Block[]) {
    this._chain = new Map<Index, Block>(blocks.map((block) => [block.index, block]));
    this.size = this._chain.size;
  }

  get(index: Index) {
    return this._chain.get(index);
  }

  toObject() {
    return Object.fromEntries(this._chain.entries());
  }
}
