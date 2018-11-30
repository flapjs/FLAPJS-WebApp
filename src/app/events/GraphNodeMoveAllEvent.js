import Event from './Event.js';

class GraphNodeMoveAllEvent extends Event
{
  constructor(graph, nodes, dx, dy)
  {
    super();

    this.graph = graph;

    this.nodeIDs = [];
    for(const node of nodes)
    {
      this.nodeIDs.push(node.getGraphElementID());
    }
    this.dx = dx;
    this.dy = dy;
  }

  //Override
  applyUndo()
  {
    const graph = this.graph;
    let nodeIndex = -1;
    let node = null;
    for(const nodeID of this.nodeIDs)
    {
      nodeIndex = graph.getNodeIndexByID(nodeID);
      if (nodeIndex < 0) throw new Error("Unable to find target in graph");
      node = graph.nodes[nodeIndex];

      node.x -= this.dx;
      node.y -= this.dy;
    }
  }

  //Override
  applyRedo()
  {
    const graph = this.graph;
    let nodeIndex = -1;
    let node = null;
    for(const nodeID of this.nodeIDs)
    {
      nodeIndex = graph.getNodeIndexByID(nodeID);
      if (nodeIndex < 0) throw new Error("Unable to find target in graph");
      node = graph.nodes[nodeIndex];

      node.x += this.dx;
      node.y += this.dy;
    }
  }
}

export default GraphNodeMoveAllEvent;
