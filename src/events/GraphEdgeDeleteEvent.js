import Event from './Event.js';

class GraphEdgeDeleteEvent extends Event
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

    //Remove edge from graph
    this.graph.edges.slice(index, 1);
  }

  //Override
  applyRedo()
  {
    //Add edge back to the graph
    this.graph.edges.push(this.edge);
  }
}

export default GraphEdgeDeleteEvent;
