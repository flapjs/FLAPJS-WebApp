import GraphNode from 'graph/GraphNode.js';
import Config from 'config.js';
import { guid } from 'util/MathHelper.js';

class Node extends GraphNode
{
  constructor(graph, x=0, y=0, label="q")
  {
    super(guid(), x, y);

    this.graph = graph;
    this.customLabel = false;

    this._label = label;
    this._accept = false;
  }

  //Override
  getNodeSize()
  {
    return Config.NODE_RADIUS;
  }

  //Override
  setNodeLabel(label)
  {
    const prevLabel = this._label;
    super.setNodeLabel(label);

    if (prevLabel != label)
    {
      this.graph.markDirty();
    }
  }

  setNodeCustom(value)
  {
    this.customLabel = value;
  }

  getNodeCustom()
  {
    return this.customLabel;
  }

  setNodeAccept(value)
  {
    const prev = this._accept;
    if (prev != value)
    {
      this._accept = value;
      this.graph.markDirty();
    }
  }

  getNodeAccept()
  {
    return this._accept;
  }
}

export default Node;
