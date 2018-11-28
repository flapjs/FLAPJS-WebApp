import Config from 'config.js';
import MachineLabeler from './MachineLabeler.js';

const DEFAULT_AUTO_RENAME = true;

class MachineBuilder
{
  constructor(graph)
  {
    this.graph = graph;
    this.graphController = null;

    this.labeler = new MachineLabeler(graph);

    this.onGraphNodeLabelChange = this.onGraphNodeLabelChange.bind(this);
  }

  initialize(app)
  {
    this.graphController = app.graphController;

    this.setAutoRenameNodes(DEFAULT_AUTO_RENAME);
  }

  destroy()
  {

  }

  onGraphNodeLabelChange(graph, node, targetNodes, prevX, prevY)
  {
    this.labeler.sortDefaultNodeLabels();
  }

  setAutoRenameNodes(enable)
  {
    const prev = this.labeler.shouldAutoLabel;
    this.labeler.shouldAutoLabel = enable;
    if (prev != enable && enable)
    {
      this.graphController.on("userDeleteNodes", this.onGraphNodeLabelChange);
    }
    else
    {
      this.graphController.removeEventListener("userDeleteNodes", this.onGraphNodeLabelChange);
    }
  }

  shouldAutoRenameNodes()
  {
    return this.labeler.shouldAutoLabel;
  }

  getLabeler()
  {
    return this.labeler;
  }
}

export default MachineBuilder;
