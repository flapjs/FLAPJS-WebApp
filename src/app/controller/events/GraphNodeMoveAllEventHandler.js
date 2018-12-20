import EventHandler from './EventHandler.js';

class GraphNodeMoveAllEventHandler extends EventHandler
{
  constructor(eventLogger, graphController)
  {
    super(eventLogger, graphController, "nodeMoveAll");
  }

  //Override
  captureEvent(graph, nodes, dx, dy)
  {
    return {
      graph: graph,
      nodeIDs: nodes.map(e => e.getGraphElementID()),
      dx: dx,
      dy: dy
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    const graph = this.controller.getGraph();
    let nodeIndex = -1;
    let node = null;
    for(const nodeID of e.eventData.nodeIDs)
    {
      nodeIndex = graph.getNodeIndexByID(nodeID);
      if (nodeIndex < 0) throw new Error("Unable to find target in graph");
      node = graph.getNodes()[nodeIndex];

      node.x -= e.eventData.dx;
      node.y -= e.eventData.dy;
    }
  }

  //Override - this = event
  applyRedo(e)
  {
    const graph = this.controller.getGraph();
    let nodeIndex = -1;
    let node = null;
    for(const nodeID of e.eventData.nodeIDs)
    {
      nodeIndex = graph.getNodeIndexByID(nodeID);
      if (nodeIndex < 0) throw new Error("Unable to find target in graph");
      node = graph.getNodes()[nodeIndex];

      node.x += e.eventData.dx;
      node.y += e.eventData.dy;
    }
  }
}
export default GraphNodeMoveAllEventHandler;
