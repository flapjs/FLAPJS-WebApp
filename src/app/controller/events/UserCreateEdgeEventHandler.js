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
    return {
      edge: edge,
      edgeID: edge.getGraphElementID(),
      fromID: edge.from.getGraphElementID(),
      toID: edge.to ? edge.to.getGraphElementID() : null,
      label: edge.getEdgeLabel(),
      quad: edge.copyQuadraticsTo({})
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    const graph = this.controller.getGraph();
    const edgeIndex = graph.getEdgeIndexByID(e.eventData.edgeID);
    if (edgeIndex < 0) throw new Error("Unable to find target in graph");
    graph.edges.splice(edgeIndex, 1);

    graph.markDirty();
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
        edge.from = graph.nodes[fromIndex];
      }
      else
      {
        throw new Error("Trying to create a sourceless edge");
      }

      const toIndex = graph.getNodeIndexByID(e.postData.toID);
      if (toIndex >= 0)
      {
        edge.to = graph.nodes[toIndex];
      }
      else
      {
        edge.to = null;
      }

      edge.setLabel(e.postData.label);
      edge.copyQuadraticsFrom(e.postData.quad);
    }

    graph.markDirty();
  }
}
export default UserCreateEdgeEventHandler;
