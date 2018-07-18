import Event from './Event.js';

class GraphNodeCreateEvent extends Event
{
  constructor(graph, node)
  {
    super();

    this.graph = graph;
    this.node = node;
  }

  //Override
  applyUndo()
  {
    const index = this.graph.nodes.indexOf(this.node);
    if (index < 0) throw new Error("Unable to find target in graph");

    this.graph.nodes.splice(index, 1);
  }

  //Override
  applyRedo()
  {
    this.graph.nodes.push(this.node);
  }
}

export default GraphNodeCreateEvent;
