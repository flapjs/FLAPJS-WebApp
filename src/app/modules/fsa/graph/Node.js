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
    this.customLabel = false;

    if (prevLabel != label)
    {
      this.graph.markDirty();
    }
  }

  setCustomLabel(label)
  {
    const prevLabel = this._label;
    this._label = label;
    this.customLabel = true;

    if (prevLabel != label)
    {
      this.graph.markDirty();
    }
  }

  hasCustomLabel()
  {
    return this.customLabel;
  }

  getNodeAccept()
  {
    return this._accept;
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
}

export default Node;
