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
    for(const node of this.nodes)
    {
      node.x -= this.dx;
      node.y -= this.dy;
    }
  }

  //Override
  applyRedo()
  {
    for(const node of this.nodes)
    {
      node.x += this.dx;
      node.y += this.dy;
    }
  }
}

export default GraphNodeMoveAllEvent;
