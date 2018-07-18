import Event from './Event.js';

class GraphNodeMoveAllEvent extends Event
{
  constructor(graph, nodes, dx, dy)
  {
    super();

    this.graph = graph;
    this.nodes = nodes;

    this.dx = dx;
    this.dy = dy;
  }

  //Override
  applyUndo()
  {
    console.log("undo move all nodes");
  }

  //Override
  applyRedo()
  {
    console.log("redo move all nodes");
  }
}

export default GraphNodeMoveAllEvent;
