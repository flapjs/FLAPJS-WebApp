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
    this.edge.setLabel(this.prevLabel);
  }

  //Override
  applyRedo()
  {
    this.edge.setLabel(this.nextLabel);
  }
}

export default GraphEdgeLabelEvent;
