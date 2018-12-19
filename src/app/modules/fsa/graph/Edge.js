import QuadraticEdge from 'graph/QuadraticEdge.js';

import { guid } from 'util/MathHelper.js';

class Edge extends QuadraticEdge
{
  constructor(graph, from, to, label)
  {
    super(guid(), from, to);

    this.graph = graph;
    this._label = label;
  }

  //Override
  setEdgeLabel(label)
  {
    const prevLabel = this._label;
    super.setEdgeLabel(label);

    if (prevLabel != label)
    {
      this.graph.emit("edgeLabel", this, label, prevLabel);

      this.graph.markDirty();
    }
  }
}

export default Edge;
