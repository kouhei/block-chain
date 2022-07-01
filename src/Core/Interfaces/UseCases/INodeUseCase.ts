import type { Node, NodeAddress } from '../../Entities';
import { ChainJson } from '../Drivers/INodeDriver';

export interface INodeUseCase {
  addNodes(nodeAddresses: NodeAddress[]): void;
  getNodes(): Set<Node>;
  getOtherNodeChain(address: string): Promise<ChainJson>;
}
