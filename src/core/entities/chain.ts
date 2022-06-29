import { Block, Index } from './block';

/** ブロックチェーンのデータを格納するところ */
export interface IChain {
  size: number;
  get(index: Index): Block | undefined;
  // lastBlock(): Block | undefined;
  toObject(): { [index: string]: Block };
  // fromObject(obj: { [index: string]: Block }): void;
}

// export class Chain implements IChain {
//   private _chain: Map<Index, Block>;

//   constructor() {
//     this._chain = new Map();
//   }

//   // TODO:値オブジェクトだからsetもっちゃダメ？ (blockを追加するときはblockが追加された新しいchainを作るとか)
//   set(block: Block) {
//     const key = block.index;
//     this._chain.set(key, block);
//   }

//   get(index: Index) {
//     return this._chain.get(index);
//   }

//   getSize() {
//     return this._chain.size;
//   }

//   lastBlock() {
//     return this._chain.get(this._chain.size) as Block;
//   }

//   toObject() {
//     return Object.fromEntries(this._chain.entries());
//   }

//   fromObject(obj: { [index: string]: Block }) {
//     this._chain = new Map(Object.entries(obj).map(([key, value]) => [Number.parseInt(key), value]));
//   }
// }

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

  // lastBlock() {
  //   return this._chain.get(this._chain.size) as Block;
  // }

  toObject() {
    return Object.fromEntries(this._chain.entries());
  }
}
