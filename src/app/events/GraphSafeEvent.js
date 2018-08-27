import Event from './Event.js';

import NodalGraph from 'graph/NodalGraph.js';

class GraphSafeEvent extends Event
{
  constructor(graph, oldGraph, newGraph)
  {
    super();

    this.graph = graph;
    this.oldGraph = oldGraph;
    this.newGraph = newGraph;
  }

  //Override
  applyUndo()
  {
    NodalGraph.parseJSON(this.oldGraph);
  }

  //Override
  applyRedo()
  {
    NodalGraph.parseJSON(this.newGraph);
  }
}

export default GraphSafeEvent;
