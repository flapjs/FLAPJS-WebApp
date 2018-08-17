import Event from './Event.js';

class GraphEdgeCreateEvent extends Event
{
  constructor(graph, edge)
  {
    super();

    this.graph = graph;
    this.edge = edge;
  }

  //Override
  applyUndo()
  {
    const index = this.graph.edges.indexOf(this.edge);
    if (index < 0) throw new Error("Unable to find target in graph");

    this.graph.edges.splice(index, 1);
  }

  //Override
  applyRedo()
  {
    this.graph.edges.push(this.edge);
  }
}

export default GraphEdgeCreateEvent;
