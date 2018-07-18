import Event from './Event.js';

class GraphNodeLabelEvent extends Event
{
  constructor(graph, node, nextLabel, prevLabel)
  {
    super();

    this.graph = graph;
    this.node = node;

    this.nextLabel = nextLabel;
    this.prevLabel = prevLabel;
  }

  //Override
  applyUndo()
  {
    this.node.label = this.prevLabel;
  }

  //Override
  applyRedo()
  {
    this.node.label = this.nextLabel;
  }
}

export default GraphNodeLabelEvent;
