import type { INodes, NodeAddress } from '../entities';
import { Node } from '../entities';
import type { INodeUseCase } from '../interfaces/useCases/INodeUseCase';

export class NodeUseCase implements INodeUseCase {
  constructor(private nodes: INodes) {}

  addNodes(nodeAddresses: NodeAddress[]) {
    nodeAddresses.map((address) => new Node(address)).forEach((node) => this.nodes.add(node));
  }

  getNodes() {
    return this.nodes.getNodes();
  }
}
