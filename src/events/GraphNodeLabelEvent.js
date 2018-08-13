import Event from './Event.js';

//TODO: this is not used!
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
    //TODO: this.node.setCustomLabel(this.prevLabel);
  }

  //Override
  applyRedo()
  {
    //TODO: this.node.setCustomLabel(this.nextLabel);
  }
}

export default GraphNodeLabelEvent;
