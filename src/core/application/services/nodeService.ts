import { INodes, Node, NodeAddress, nodes } from '../../domain/node';

class NodeService {
  constructor(private nodes: INodes) {}

  addNodes(nodeAddresses: NodeAddress[]) {
    nodeAddresses.map((address) => new Node(address)).forEach((node) => this.nodes.add(node));
    return Array.from(this.nodes.getNodes().values());
  }

  getNodes() {
    return this.nodes.getNodes();
  }
}

export const nodeService = new NodeService(nodes);
