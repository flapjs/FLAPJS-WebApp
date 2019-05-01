import EventHandler from './EventHandler.js';

class GraphEdgeMoveEventHandler extends EventHandler
{
  constructor(eventLogger, graphController)
  {
    super(eventLogger, graphController, "edgeMove");
  }

  /** @override */
  captureEvent(graph, targetEdge, nextQuad, prevQuad)
  {
    return {
      graph: graph,
      edgeID: targetEdge.getGraphElementID(),
      nextQuad: Object.assign({}, nextQuad),
      prevQuad: Object.assign({}, prevQuad)
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    const graph = this.controller.getGraph();
    const edge = graph.getEdgeByElementID(e.eventData.edgeID);
    if (!edge) throw new Error("Unable to find target in graph");

    edge.setQuadratic(e.eventData.prevQuad.radians, e.eventData.prevQuad.length);
  }

  //Override - this = event
  applyRedo(e)
  {
    const graph = this.controller.getGraph();
    const edge = graph.getEdgeByElementID(e.eventData.edgeID);
    if (!edge) throw new Error("Unable to find target in graph");

    edge.setQuadratic(e.eventData.nextQuad.radians, e.eventData.nextQuad.length);
  }
}
export default GraphEdgeMoveEventHandler;
