import type { Block } from '../../Entities';

export interface ChainJson {
  chain?: { [index: string]: Block };
  length?: number;
}

export interface INodeDriver {
  getChain(url: string): Promise<ChainJson>;
}
