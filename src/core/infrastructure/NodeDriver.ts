import axios, { AxiosResponseHeaders } from 'axios';
import type { Block } from '../Entities';
import type { INodeDriver } from '../Interfaces/Drivers/INodeDriver';

class NetWorkError extends Error {
  constructor(error: { status: number; statusText: string; headers: AxiosResponseHeaders; message: string }) {
    super(error.message);
    this.name = 'NetworkError';
  }
}

export class NodeDriver implements INodeDriver {
  async getChain(url: string) {
    const res = await axios.get<{ chain?: { [index: string]: Block }; length?: string }>(url);
    if (res.status !== 200) {
      throw new NetWorkError({
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        message: `node(${url}): status is not ok`,
      });
    }

    const data = res.data;
    return {
      chain: data?.chain,
      length: Number.parseInt(data?.length || ''),
    };
  }
}
