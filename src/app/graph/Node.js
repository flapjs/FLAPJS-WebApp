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
      this.graph.emit("nodeLabel", this, this._label, prevLabel);
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
      this.graph.emit("nodeCustomLabel", this, this._label, prevLabel);
      this.graph.markDirty();
    }
  }

  hasCustomLabel()
  {
    return this.customLabel;
  }

  get label() { return this._label; }
  set label(value) {
    throw new Error("Deprecated!");
  }

  get accept() { return this._accept; }
  set accept(value) {
    let prevAccept = this._accept;
    this._accept = value;
    if (prevAccept != value)
    {
      this.graph.emit("toggleAccept", this, this._accept, prevAccept);
      this.graph.markDirty();
    }
  }
}

export default Node;
