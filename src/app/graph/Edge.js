import GraphCurvedEdge from 'graph/GraphCurvedEdge.js';
import Config from 'config.js';

import { guid } from 'util/MathHelper.js';
import Node from './Node.js';

class Edge extends GraphCurvedEdge
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
