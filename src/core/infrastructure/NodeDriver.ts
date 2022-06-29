import axios from 'axios';
import type { Block } from '../entities';
import type { INodeDriver } from '../interfaces/drivers/INodeDriver';

export class NodeDriver implements INodeDriver {
  async getChain(url: string) {
    const data = (await axios.get<{ chain?: { [index: string]: Block }; length?: string }>(url)).data;
    return {
      chain: data?.chain,
      length: Number.parseInt(data?.length || ''),
    };
  }
}
