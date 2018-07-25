
class Node
{
  constructor(graph, x=0, y=0, label="q")
  {
    this.graph = graph;
    this.x = x;
    this.y = y;

    this._label = label;
    this._accept = false;
  }

  get label() { return this._label; }
  set label(value) {
    let prevLabel = this._label;
    this._label = value;

    if (prevLabel != value)
    {
      this.graph.emit("nodeLabel", this, this._label, prevLabel);
      this.graph.markDirty();
    }
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
