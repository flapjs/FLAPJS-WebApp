import Event from './Event.js';

class GraphNodeMoveEvent extends Event
{
  constructor(graph, node, nextX, nextY, prevX, prevY)
  {
    super();

    this.graph = graph;

    this.nodeID = node.id;
    this.nextX = nextX;
    this.nextY = nextY;
    this.prevX = prevX;
    this.prevY = prevY;
  }

  //Override
  applyUndo()
  {
    const graph = this.graph;
    const nodeIndex = graph.getNodeIndexByID(this.nodeID);
    if (nodeIndex < 0) throw new Error("Unable to find target in graph");
    const node = graph.nodes[nodeIndex];
    node.x = this.prevX;
    node.y = this.prevY;
  }

  //Override
  applyRedo()
  {
    const graph = this.graph;
    const nodeIndex = graph.getNodeIndexByID(this.nodeID);
    if (nodeIndex < 0) throw new Error("Unable to find target in graph");
    const node = graph.nodes[nodeIndex];
    node.x = this.nextX;
    node.y = this.nextY;
  }
}

export default GraphNodeMoveEvent;
