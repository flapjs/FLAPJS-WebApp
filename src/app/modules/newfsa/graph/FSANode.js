import GraphNode from 'graph/GraphNode.js';

class FSANode extends GraphNode
{
  constructor(id, x, y)
  {
    super(id, x, y);

    this._accept = false;
  }

  setNodeAccept(value)
  {
    this._accept = value;
  }

  getNodeAccept()
  {
    return this._accept;
  }

  //Override
  getNodeSize()
  {
    return Config.NODE_RADIUS;
  }

  //Override
  getHashCode()
  {
    return (super.getHashCode() << 1) | (this._accept ? 1 : 0);
  }
}

export default FSANode;
