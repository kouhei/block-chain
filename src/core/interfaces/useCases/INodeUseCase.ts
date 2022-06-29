import { Node, NodeAddress } from '../../entities';

export interface INodeUseCase {
  addNodes(nodeAddresses: NodeAddress[]): void;
  getNodes(): Set<Node>;
}
