import GraphEventHandler from './GraphEventHandler.js';

class UserCreateNodeEventHandler extends GraphEventHandler
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
      nodeID: node.id,
      x: node.x,
      y: node.y
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    const graph = this.graphController.getGraph();
    const nodeIndex = graph.getNodeIndexByID(e.eventData.nodeID);
    if (nodeIndex < 0) throw new Error("Unable to find target in graph");
    graph.nodes.splice(nodeIndex, 1);
  }

  //Override - this = event
  applyRedo(e)
  {
    const graph = this.graphController.getGraph();
    const nodeIndex = graph.getNodeIndexByID(e.postData.nodeID);
    if (nodeIndex < 0)
    {
      const node = e.postData.node;
      graph.nodes.push(node);

      node.x = e.postData.x;
      node.y = e.postData.y;
      node.id = e.postData.nodeID;
    }
  }
}
export default UserCreateNodeEventHandler;
