import Event from './Event.js';

class GraphEdgeLabelEvent extends Event
{
  constructor(graph, edge, nextLabel, prevLabel)
  {
    super();

    this.graph = graph;
    this.edge = edge;

    this.nextLabel = nextLabel;
    this.prevLabel = prevLabel;
  }

  //Override
  applyUndo()
  {
    this.edge.label = this.prevLabel;
  }

  //Override
  applyRedo()
  {
    this.edge.label = this.nextLabel;
  }
}

export default GraphEdgeLabelEvent;
