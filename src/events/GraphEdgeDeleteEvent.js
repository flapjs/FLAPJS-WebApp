import Event from './Event.js';

class GraphEdgeDeleteEvent extends Event
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
    console.log("undo delete an edge");
  }

  //Override
  applyRedo()
  {
    console.log("redo delete an edge");
  }
}

export default GraphEdgeDeleteEvent;
