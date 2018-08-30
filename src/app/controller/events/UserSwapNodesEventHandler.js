import EventHandler from './EventHandler.js';

class UserSwapNodesEventHandler extends EventHandler
{
  constructor(eventLogger, graphController)
  {
    super(eventLogger, graphController, "userSwapNodes");
  }

  //Override
  captureEvent(graph, node, otherNode)
  {
    return {
      nodeID: node.id,
      otherID: otherNode.id
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    const graph = this.controller.getGraph();
    const nodeIndex = graph.getNodeIndexByID(e.eventData.nodeID);
    if (nodeIndex < 0) throw new Error("Unable to find target in graph");
    const otherIndex = graph.getNodeIndexByID(e.eventData.otherID);
    if (otherIndex < 0) throw new Error("Unable to find other target in graph");

    const node = graph.nodes[nodeIndex];
    graph.nodes[nodeIndex] = graph.nodes[otherIndex];
    graph.nodes[otherIndex] = node;

    graph.markDirty();
  }

  //Override - this = event
  applyRedo(e)
  {
    const graph = this.controller.getGraph();
    const nodeIndex = graph.getNodeIndexByID(e.eventData.nodeID);
    if (nodeIndex < 0) throw new Error("Unable to find target in graph");
    const otherIndex = graph.getNodeIndexByID(e.eventData.otherID);
    if (otherIndex < 0) throw new Error("Unable to find other target in graph");

    const node = graph.nodes[nodeIndex];
    graph.nodes[nodeIndex] = graph.nodes[otherIndex];
    graph.nodes[otherIndex] = node;

    graph.markDirty();
  }
}
export default UserSwapNodesEventHandler;
