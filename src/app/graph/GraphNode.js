import GraphElement from 'graph/GraphElement.js';
import { stringHash } from 'util/MathHelper.js';

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

  //Override
  getHashCode()
  {
    return stringHash(this._id + "." + Math.floor(this.x) + "," + Math.floor(this.y) + "." + this._label);
  }
}

export default GraphNode;
