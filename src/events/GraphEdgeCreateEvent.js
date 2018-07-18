import Event from './Event.js';

class GraphEdgeCreateEvent extends Event
{
  constructor(graph, edge)
  {
    super();

    this.graph = graph;
    this.edge = edge;
  }

  //Override
  applyUndo()
  {
    console.log("undo create an edge");
  }

  //Override
  applyRedo()
  {
    console.log("redo create an edge");
  }
}

export default GraphEdgeCreateEvent;
