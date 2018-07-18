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
    console.log("undo create node");
  }

  //Override
  applyRedo()
  {
    console.log("redo create node");
  }
}

export default GraphNodeCreateEvent;
