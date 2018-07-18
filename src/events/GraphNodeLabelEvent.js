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
    console.log("undo node label");
  }

  //Override
  applyRedo()
  {
    console.log("redo node label");
  }
}

export default GraphNodeLabelEvent;
