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
      isCustom: node.hasCustomLabel()
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    const graph = this.controller.getGraph();
    const nodeIndex = graph.getNodeIndexByID(e.eventData.nodeID);
    if (nodeIndex < 0) throw new Error("Unable to find target in graph");
    graph.nodes.splice(nodeIndex, 1);

    graph.markDirty();
  }

  //Override - this = event
  applyRedo(e)
  {
    const graph = this.controller.getGraph();
    const nodeIndex = graph.getNodeIndexByID(e.postData.nodeID);
    if (nodeIndex < 0)
    {
      const node = e.postData.node;
      graph.nodes.push(node);

      node.x = e.postData.x;
      node.y = e.postData.y;
      node.setNodeID(e.postData.nodeID);
      if (e.postData.isCustom)
      {
        node.setCustomLabel(e.postData.label);
      }
      else
      {
        node.setNodeLabel(e.postData.label);
      }
    }

    graph.markDirty();
  }
}
export default UserCreateNodeEventHandler;
