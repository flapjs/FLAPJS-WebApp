import Event from './Event.js';

class GraphNodeAcceptEvent extends Event
{
  constructor(graph, node, nextAccept, prevAccept)
  {
    super();

    this.graph = graph;
    this.node = node;

    this.nextAccept = nextAccept;
    this.prevAccept = prevAccept;
  }

  //Override
  applyUndo()
  {
    console.log("undo accept node");
  }

  //Override
  applyRedo()
  {
    console.log("redo accept node");
  }
}

export default GraphNodeAcceptEvent;
