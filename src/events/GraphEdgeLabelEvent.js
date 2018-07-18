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
    console.log("undo edge label");
  }

  //Override
  applyRedo()
  {
    console.log("redo edge label");
  }
}

export default GraphEdgeLabelEvent;
