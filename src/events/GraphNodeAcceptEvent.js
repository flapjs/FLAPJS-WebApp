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
    this.node.accept = this.prevAccept;
  }

  //Override
  applyRedo()
  {
    this.node.accept = this.nextAccept;
  }
}

export default GraphNodeAcceptEvent;
