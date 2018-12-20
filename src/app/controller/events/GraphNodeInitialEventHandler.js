import EventHandler from './EventHandler.js';

class GraphEdgeDestinationEventHandler extends EventHandler
{
  constructor(eventLogger, graphController)
  {
    super(eventLogger, graphController, "nodeInitial");
  }

  //Override
  captureEvent(graph, nextInitial, prevInitial)
  {
    return {
      graph: graph,
      nodeID: nextInitial.getGraphElementID(),
      prevID: prevInitial.getGraphElementID()
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    const graph = this.controller.getGraph();
    const nodeIndex = graph.getNodeIndexByID(e.eventData.prevID);
    if (nodeIndex < 0) throw new Error("Unable to find target in graph");
    const node = graph.getNodes()[nodeIndex];

    graph.setStartNode(node);
  }

  //Override - this = event
  applyRedo(e)
  {
    const graph = this.controller.getGraph();
    const nodeIndex = graph.getNodeIndexByID(e.eventData.nodeID);
    if (nodeIndex < 0) throw new Error("Unable to find target in graph");
    const node = graph.getNodes()[nodeIndex];

    graph.setStartNode(node);
  }
}
export default GraphEdgeDestinationEventHandler;
