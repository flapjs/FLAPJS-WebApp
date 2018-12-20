import EventHandler from './EventHandler.js';

class UserDeleteEdgeEventHandler extends EventHandler
{
  constructor(eventLogger, graphController)
  {
    super(eventLogger, graphController, "userPreDeleteEdge");
  }

  //Override
  captureEvent(graph, edge, prevTo, prevQuad)
  {
    return {
      edge: edge,
      edgeID: edge.getGraphElementID(),
      fromID: edge.getSourceNode().getGraphElementID(),
      toID: prevTo ? prevTo.getGraphElementID() : null,
      quad: Object.assign({}, prevQuad)
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    const graph = this.controller.getGraph();
    const edgeIndex = graph.getEdgeIndexByID(e.eventData.edgeID);
    if (edgeIndex < 0)
    {
      const edge = e.eventData.edge;
      graph.edges.push(edge);

      const fromIndex = graph.getNodeIndexByID(e.eventData.fromID);
      if (fromIndex >= 0)
      {
        edge.setSourceNode(graph.nodes[fromIndex]);
      }
      else
      {
        throw new Error("Trying to create a sourceless edge");
      }

      const toIndex = graph.getNodeIndexByID(e.eventData.toID);
      if (toIndex >= 0)
      {
        edge.changeDestinationNode(graph.nodes[toIndex]);
      }
      else
      {
        edge.changeDestinationNode(null);
      }

      edge.setQuadratic(e.eventData.quad.radians, e.eventData.quad.length);
    }
  }

  //Override - this = event
  applyRedo(e)
  {
    const graph = this.controller.getGraph();
    const edgeIndex = graph.getEdgeIndexByID(e.postData.edgeID);
    if (edgeIndex < 0) throw new Error("Unable to find target in graph");
    graph.getEdges().splice(edgeIndex, 1);
  }
}
export default UserDeleteEdgeEventHandler;
