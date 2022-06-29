import type { Block } from '../../entities';

export interface ChainJson {
  chain?: { [index: string]: Block };
  length?: number;
}

export interface INodeDriver {
  getChain(url: string): Promise<ChainJson>;
}
