import EventHandler from './EventHandler.js';

class UserCreateNodeEventHandler extends EventHandler
{
  constructor(eventLogger, graphController)
  {
    super(eventLogger, graphController, "userPostCreateNode");
  }

  //Override
  captureEvent(graph, node)
  {
    return {
      node: node,
      nodeID: node.getGraphElementID(),
      x: node.x,
      y: node.y,
      label: node.getNodeLabel(),
      isCustom: node.getNodeCustom()
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    const graph = this.controller.getGraph();
    const nodeIndex = graph.getNodeIndexByID(e.eventData.nodeID);
    if (nodeIndex < 0) throw new Error("Unable to find target in graph");
    graph.getNodes().splice(nodeIndex, 1);
  }

  //Override - this = event
  applyRedo(e)
  {
    const graph = this.controller.getGraph();
    const nodeIndex = graph.getNodeIndexByID(e.postData.nodeID);
    if (nodeIndex < 0)
    {
      const node = e.postData.node;
      graph.getNodes().push(node);

      node.x = e.postData.x;
      node.y = e.postData.y;
      node.setNodeID(e.postData.nodeID);
      node.setNodeLabel(e.postData.label);
      node.setNodeCustom(e.postData.isCustom);
    }
  }
}
export default UserCreateNodeEventHandler;
