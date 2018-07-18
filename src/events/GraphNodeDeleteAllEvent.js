import Event from './Event.js';

class GraphNodeDeleteAllEvent extends Event
{
  constructor(graph, nodes)
  {
    super();

    this.graph = graph;
    this.nodes = nodes;
  }

  //Override
  applyUndo()
  {
    console.log("undo delete selected nodes");
  }

  //Override
  applyRedo()
  {
    console.log("redo delete selected nodes");
  }
}

export default GraphNodeDeleteAllEvent;
