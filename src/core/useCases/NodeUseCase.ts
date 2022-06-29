import { INodes, Node, NodeAddress } from '../entities';
import { INodeUseCase } from '../interfaces/useCases/INodeUseCase';

export class NodeUseCase implements INodeUseCase {
  constructor(private nodes: INodes) {}

  addNodes(nodeAddresses: NodeAddress[]) {
    nodeAddresses.map((address) => new Node(address)).forEach((node) => this.nodes.add(node));
  }

  getNodes() {
    return this.nodes.getNodes();
  }
}
