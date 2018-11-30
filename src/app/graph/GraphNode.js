import GraphElement from 'graph/GraphElement.js';

class GraphNode extends GraphElement
{
  constructor(id, x, y)
  {
    super(id);

    this.x = x;
    this.y = y;

    this._label = "";
  }

  setNodeLabel(label)
  {
    this._label = label;
    return this;
  }

  getNodeLabel()
  {
    return this._label;
  }

  getNodeSize()
  {
    return 10;
  }
}

export default GraphNode;
