import Event from './Event.js';

class GraphNodeInitialEvent extends Event
{
  constructor(graph, nextInitial, prevInitial)
  {
    super();

    this.graph = graph;

    this.nodeID = nextInitial.getGraphElementID();
    this.prevID = prevInitial.getGraphElementID();
  }

  //Override
  applyUndo()
  {
    const graph = this.graph;
    const nodeIndex = graph.getNodeIndexByID(this.prevID);
    if (nodeIndex < 0) throw new Error("Unable to find target in graph");
    const node = graph.getNodes()[nodeIndex];

    this.graph.setStartNode(node);
  }

  //Override
  applyRedo()
  {
    const graph = this.graph;
    const nodeIndex = graph.getNodeIndexByID(this.nodeID);
    if (nodeIndex < 0) throw new Error("Unable to find target in graph");
    const node = graph.getNodes()[nodeIndex];

    this.graph.setStartNode(node);
  }
}

export default GraphNodeInitialEvent;
