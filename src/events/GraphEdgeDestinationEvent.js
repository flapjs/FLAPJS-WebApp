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
    this.prevQuadX = prevQuad.x;
    this.prevQuadY = prevQuad.y;
    this.nextQuadX = edge.quad.x;
    this.nextQuadY = edge.quad.y;
  }

  //Override
  applyUndo()
  {
    this.edge.to = this.prevDestination;
    this.edge.quad.x = this.prevQuadX;
    this.edge.quad.y = this.prevQuadY;
  }

  //Override
  applyRedo()
  {
    this.edge.to = this.nextDestination;
    this.edge.quad.x = this.nextQuadX;
    this.edge.quad.y = this.nextQuadY;
  }
}

export default GraphEdgeDestinationEvent;
