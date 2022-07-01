import type { INodes, NodeAddress } from '../Entities';
import { Node } from '../Entities';
import type { ChainJson, INodeDriver } from '../Interfaces/Drivers/INodeDriver';
import type { INodeUseCase } from '../Interfaces/UseCases/INodeUseCase';

export class NodeUseCase implements INodeUseCase {
  constructor(private nodes: INodes, private nodeDriver: INodeDriver) {}

  addNodes(nodeAddresses: NodeAddress[]) {
    nodeAddresses.map((address) => new Node(address)).forEach((node) => this.nodes.add(node));
  }

  getNodes() {
    return this.nodes.getNodes();
  }

  getOtherNodeChain(address: string): Promise<ChainJson> {
    return this.nodeDriver.getChain(`${address}/chain`);
  }
}
