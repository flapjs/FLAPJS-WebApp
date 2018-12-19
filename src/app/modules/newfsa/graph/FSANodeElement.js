import GraphNode from 'graph/GraphNode.js';

class FSANodeElement extends GraphNode
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
}

export default FSANodeElement;
