import EventHandler from './EventHandler.js';

class UserRenameNodeEventHandler extends EventHandler
{
  constructor(eventLogger, graphController)
  {
    super(eventLogger, graphController, "userRenameNode");
  }

  //Override
  captureEvent(graph, node, nextLabel, prevLabel, isPrevCustom)
  {
    return {
      node: node,
      nodeID: node.getGraphElementID(),
      nextLabel: nextLabel,
      prevLabel: prevLabel,
      prevCustom: isPrevCustom
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    const graph = this.controller.getGraph();
    const nodeIndex = graph.getNodeIndexByID(e.eventData.nodeID);
    if (nodeIndex < 0) throw new Error("Unable to find target in graph");
    const node = graph.nodes[nodeIndex];
    node.setNodeLabel(e.eventData.prevLabel);
    node.setNodeCustom(e.eventData.prevCustom);
  }

  //Override - this = event
  applyRedo(e)
  {
    const graph = this.controller.getGraph();
    const nodeIndex = graph.getNodeIndexByID(e.eventData.nodeID);
    if (nodeIndex < 0) throw new Error("Unable to find target in graph");
    const node = graph.nodes[nodeIndex];
    node.setNodeLabel(e.eventData.nextLabel);
    node.setNodeCustom(true);
  }
}
export default UserRenameNodeEventHandler;
