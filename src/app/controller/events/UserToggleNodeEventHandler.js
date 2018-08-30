import EventHandler from './EventHandler.js';

class UserToggleNodeEventHandler extends EventHandler
{
  constructor(eventLogger, graphController)
  {
    super(eventLogger, graphController, "userToggleNode");
  }

  //Override
  captureEvent(graph, node, prevAccept)
  {
    return {
      nodeID: node.id,
      prevAccept: prevAccept
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    const graph = this.controller.getGraph();
    const nodeIndex = graph.getNodeIndexByID(e.eventData.nodeID);
    if (nodeIndex < 0) throw new Error("Unable to find target in graph");
    graph.nodes[nodeIndex].accept = e.eventData.prevAccept;
  }

  //Override - this = event
  applyRedo(e)
  {
    const graph = this.controller.getGraph();
    const nodeIndex = graph.getNodeIndexByID(e.eventData.nodeID);
    if (nodeIndex < 0) throw new Error("Unable to find target in graph");
    graph.nodes[nodeIndex].accept = !e.eventData.prevAccept;
  }
}
export default UserToggleNodeEventHandler;
