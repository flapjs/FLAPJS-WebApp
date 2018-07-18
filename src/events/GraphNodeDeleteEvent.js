import Event from './Event.js';

class GraphNodeDeleteEvent extends Event
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
    console.log("undo delete node");
  }

  //Override
  applyRedo()
  {
    console.log("redo delete node");
  }
}

export default GraphNodeDeleteEvent;
