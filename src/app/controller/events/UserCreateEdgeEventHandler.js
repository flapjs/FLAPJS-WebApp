import EventHandler from './EventHandler.js';

class UserCreateEdgeEventHandler extends EventHandler
{
  constructor(eventLogger, graphController)
  {
    super(eventLogger, graphController, "userPostCreateEdge");
  }

  //Override
  captureEvent(graph, edge)
  {
    const edgeQuad = edge.getQuadratic();
    return {
      edge: edge,
      edgeID: edge.getGraphElementID(),
      fromID: edge.getSourceNode().getGraphElementID(),
      toID: edge.getDestinationNode() ? edge.getDestinationNode().getGraphElementID() : null,
      label: edge.getEdgeLabel(),
      quad: { radians: edgeQuad.radians, length: edgeQuad.length }
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    //TODO: when formatting edges change an edge different than this one, it does not revert them.
    const graph = this.controller.getGraph();
    const edgeIndex = graph.getEdgeIndexByID(e.eventData.edgeID);
    if (edgeIndex < 0) throw new Error("Unable to find target in graph");
    graph.getEdges().splice(edgeIndex, 1);
  }

  //Override - this = event
  applyRedo(e)
  {
    const graph = this.controller.getGraph();
    const edgeIndex = graph.getEdgeIndexByID(e.postData.edgeID);
    if (edgeIndex < 0)
    {
      const edge = e.postData.edge;
      graph.edges.push(edge);

      const fromIndex = graph.getNodeIndexByID(e.postData.fromID);
      if (fromIndex >= 0)
      {
        edge.setSourceNode(graph.nodes[fromIndex]);
      }
      else
      {
        throw new Error("Trying to create a sourceless edge");
      }

      const toIndex = graph.getNodeIndexByID(e.postData.toID);
      if (toIndex >= 0)
      {
        edge.setDestinationNode(graph.nodes[toIndex]);
      }
      else
      {
        edge.setDestinationNode(null);
      }

      edge.setEdgeLabel(e.postData.label);
      edge.setQuadratic(e.postData.quad.radians, e.postData.quad.length);
    }
  }
}
export default UserCreateEdgeEventHandler;
