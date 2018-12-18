class RedBlackNode
{
  constructor(x, y, label, red)
  {
    this._x = 0;
    this._y = 0;
    this._label = "";
    this._red = red;
  }
}

class RedBlackEdge
{
  constructor(from, to)
  {
    this._from = from;
    this._to = to;
  }
}

class RedBlackGraph
{
  constructor()
  {
    this._nodes = [];
    this._edges = [];
  }

  newNode(x, y)
  {

  }

  newEdge(from, to)
  {

  }

  deleteNode(node)
  {

  }

  deleteEdge(edge)
  {

  }

  getNodes()
  {
    return this._nodes;
  }

  getEdges()
  {
    return this._edges;
  }

  getBoundingRect()
  {
    
  }
}

export default RedBlackGraph;
