import { guid } from 'util/MathHelper.js';

class Node
{
  constructor(graph, x=0, y=0, label="q")
  {
    this.graph = graph;
    this.x = x;
    this.y = y;
    this.customLabel = false;
    this.id = guid();

    this._label = label;
    this._accept = false;
  }

  setLabel(label)
  {
    const prevLabel = this._label;
    this._label = label;
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
