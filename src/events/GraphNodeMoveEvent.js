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
    console.log("undo move node");
  }

  //Override
  applyRedo()
  {
    console.log("redo move node");
  }
}

export default GraphNodeMoveEvent;
