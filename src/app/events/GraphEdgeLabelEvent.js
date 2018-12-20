import Event from './Event.js';

class GraphEdgeLabelEvent extends Event
{
  constructor(graph, edge, nextLabel, prevLabel)
  {
    super();

    this.graph = graph;
    this.edge = edge;
    this.edgeID = edge.getGraphElementID();

    this.nextLabel = nextLabel;
    this.prevLabel = prevLabel;
  }

  //Override
  applyUndo()
  {
    const graph = this.graph;
    const edgeIndex = graph.getEdgeIndexByID(this.edgeID);
    if (edgeIndex < 0) throw new Error("Unable to find target in graph");
    const edge = graph.getEdges()[edgeIndex];

    edge.setEdgeLabel(this.prevLabel);
  }

  //Override
  applyRedo()
  {
    const graph = this.graph;
    const edgeIndex = graph.getEdgeIndexByID(this.edgeID);
    if (edgeIndex < 0) throw new Error("Unable to find target in graph");
    const edge = graph.getEdges()[edgeIndex];

    edge.setEdgeLabel(this.nextLabel);
  }
}

export default GraphEdgeLabelEvent;
