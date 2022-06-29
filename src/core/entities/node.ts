export type NodeAddress = string;

export class Node {
  constructor(public address: NodeAddress) {}
}

/** ネットワーク上のノードリスト */
export interface INodes {
  getNodes(): Set<Node>;
  add(node: Node): void;
}

export class Nodes implements INodes {
  private _nodes: Set<NodeAddress>; // TODO: http://example.com みたいな形式を想定。プロトコルやパスがついてても問題なく動くようにする
  constructor() {
    this._nodes = new Set();
  }

  getNodes() {
    return new Set(Array.from(this._nodes.values()).map((address) => new Node(address)));
  }

  add(node: Node) {
    this._nodes.add(node.address);
  }
}

// export const nodes = new Nodes();
