import Event from './Event.js';

class GraphEdgeDestinationEvent extends Event
{
  constructor(graph, edge, nextDestination, prevDestination)
  {
    super();

    this.graph = graph;
    this.edge = edge;

    this.nextDestination = nextDestination;
    this.prevDestination = prevDestination;
  }

  //Override
  applyUndo()
  {
    console.log("undo set dest for edge");
  }

  //Override
  applyRedo()
  {
    console.log("redo set dest for edge");
  }
}

export default GraphEdgeDestinationEvent;
