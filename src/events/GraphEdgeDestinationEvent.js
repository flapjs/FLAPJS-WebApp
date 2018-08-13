import Event from './Event.js';

class GraphEdgeDestinationEvent extends Event
{
  constructor(graph, edge, nextDestination, prevDestination, prevQuad)
  {
    super();

    this.graph = graph;
    this.edge = edge;

    this.nextDestination = nextDestination;
    this.prevDestination = prevDestination;
    this.nextQuad = edge.copyQuadraticsTo({});
    this.prevQuad = Object.assign({}, prevQuad);
  }

  //Override
  applyUndo()
  {
    this.edge.to = this.prevDestination;
    this.edge.copyQuadraticsFrom(this.prevQuad);
  }

  //Override
  applyRedo()
  {
    this.edge.to = this.nextDestination;
    this.edge.copyQuadraticsFrom(this.nextQuad);
  }
}

export default GraphEdgeDestinationEvent;
