import Event from './Event.js';

class GraphNodeInitialEvent extends Event
{
  constructor(graph, nextInitial, prevInitial)
  {
    super();

    this.graph = graph;

    this.nextInitial = nextInitial;
    this.prevInitial = prevInitial;
  }

  //Override
  applyUndo()
  {
    this.graph.setStartNode(this.prevInitial);
  }

  //Override
  applyRedo()
  {
    this.graph.setStartNode(this.nextInitial);
  }
}

export default GraphNodeInitialEvent;
