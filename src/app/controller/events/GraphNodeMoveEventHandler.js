import EventHandler from './EventHandler.js';

class GraphNodeMoveEventHandler extends EventHandler
{
  constructor(eventLogger, graphController)
  {
    super(eventLogger, graphController, "nodeMove");
  }

  //Override
  captureEvent(graph, targetNode, nextX, nextY, prevX, prevY)
  {
    return {
      graph: graph,
      nodeID: targetNode.getGraphElementID(),
      nextX: nextX,
      nextY: nextY,
      prevX: prevX,
      prevY: prevY
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    const graph = this.controller.getGraph();
    const nodeIndex = graph.getNodeIndexByID(e.eventData.nodeID);
    if (nodeIndex < 0) throw new Error("Unable to find target in graph");
    const node = graph.getNodes()[nodeIndex];
    node.x = e.eventData.prevX;
    node.y = e.eventData.prevY;
  }

  //Override - this = event
  applyRedo(e)
  {
    const graph = this.controller.getGraph();
    const nodeIndex = graph.getNodeIndexByID(e.eventData.nodeID);
    if (nodeIndex < 0) throw new Error("Unable to find target in graph");
    const node = graph.getNodes()[nodeIndex];
    node.x = e.eventData.nextX;
    node.y = e.eventData.nextY;
  }
}
export default GraphNodeMoveEventHandler;
