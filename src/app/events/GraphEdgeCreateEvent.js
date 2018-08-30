import Event from './Event.js';

class GraphEdgeCreateEvent extends Event
{
  constructor(graph, edge)
  {
    super();

    this.graph = graph;

    this.edge = edge;
    this.edgeID = this.edge.id;
    this.fromID = this.edge.from ? this.edge.from.id : -1;
    this.toID = this.edge.to ? this.edge.to.id : -1;
  }

  //Override
  applyUndo()
  {
    const graph = this.graph;
    const edgeIndex = graph.getEdgeIndexByID(this.edgeID);
    if (edgeIndex < 0) throw new Error("Unable to find target in graph");

    graph.edges.splice(edgeIndex, 1);
  }

  //Override
  applyRedo()
  {
    const graph = this.graph;
    const edgeIndex = graph.getEdgeIndexByID(this.edgeID);
    if (edgeIndex < 0)
    {
      this.graph.edges.push(this.edge);
      this.edge.id = this.edgeID;

      if (this.fromID >= 0)
      {
        const fromIndex = graph.getNodeIndexByID(this.fromID);
        if (fromIndex < 0) throw new Error("Unable to find target in graph");
        this.edge.from = graph.nodes[fromIndex];
      }
      else
      {
        throw new Error("Trying to create a sourceless edge");
      }

      if (this.toID >= 0)
      {
        const toIndex = graph.getNodeIndexByID(this.toID);
        if (toIndex < 0) throw new Error("Unable to find target in graph");
        this.edge.to = graph.nodes[toIndex];
      }
      else
      {
        this.edge.to = null;
      }
    }
  }
}

export default GraphEdgeCreateEvent;
