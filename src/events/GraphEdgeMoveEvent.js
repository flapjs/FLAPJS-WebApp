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
    console.log("undo move edge");
  }

  //Override
  applyRedo()
  {
    console.log("redo move edge");
  }
}

export default GraphEdgeMoveEvent;
