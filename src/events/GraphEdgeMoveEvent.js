import Event from './Event.js';

class GraphEdgeMoveEvent extends Event
{
  constructor(graph, edge, nextX, nextY, prevX, prevY)
  {
    super();

    this.graph = graph;
    this.edge = edge;

    this.nextX = nextX;
    this.nextY = nextY;
    this.prevX = prevX;
    this.prevY = prevY;
  }

  //Override
  applyUndo()
  {
    this.edge.quad.x = this.prevX;
    this.edge.quad.y = this.prevY;
  }

  //Override
  applyRedo()
  {
    this.edge.quad.x = this.nextX;
    this.edge.quad.y = this.nextY;
  }
}

export default GraphEdgeMoveEvent;
