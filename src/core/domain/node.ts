export type NodeAddress = string;

export class Node {
  constructor(public address: NodeAddress) {}
}

/** ネットワーク上のノードリスト */
export interface INodes {
  getNodes(): Set<Node>;
  add(node: Node): void;
}

class Nodes implements INodes {
  private _nodes: Set<Node>; // TODO: http://example.com みたいな形式を想定。プロトコルやパスがついてても問題なく動くようにする
  constructor() {
    this._nodes = new Set();
  }

  getNodes() {
    return this._nodes;
  }

  add(node: Node) {
    this._nodes.add(node);
  }
}

export const nodes = new Nodes();
