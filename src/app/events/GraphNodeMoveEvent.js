import Event from './Event.js';

class GraphNodeMoveEvent extends Event
{
  constructor(graph, node, nextX, nextY, prevX, prevY)
  {
    super();

    this.graph = graph;
    this.node = node;

    this.nextX = nextX;
    this.nextY = nextY;
    this.prevX = prevX;
    this.prevY = prevY;
  }

  //Override
  applyUndo()
  {
    this.node.x = this.prevX;
    this.node.y = this.prevY;
  }

  //Override
  applyRedo()
  {
    this.node.x = this.nextX;
    this.node.y = this.nextY;
  }
}

export default GraphNodeMoveEvent;
