import Config from 'config.js';
import MachineLabeler from './MachineLabeler.js';

const DEFAULT_AUTO_RENAME = true;

class MachineBuilder
{
  constructor(graph, controller)
  {
    this.graph = graph;
    this.controller = controller;

    //TODO: this is hooked into the controller in App.js
    this.shouldAutoLabel = false;
    this.labeler = new MachineLabeler(graph);

    this.onGraphNodeLabelChange = this.onGraphNodeLabelChange.bind(this);
  }

  initialize(app)
  {
    this.setAutoRenameNodes(DEFAULT_AUTO_RENAME);
  }

  destroy()
  {

  }

  onGraphNodeLabelChange()
  {
    this.labeler.sortDefaultNodeLabels();
  }

  setAutoRenameNodes(enable)
  {
    const prev = this.shouldAutoLabel;
    this.shouldAutoLabel = enable;
    if (prev != enable && enable)
    {
      this.controller.on("nodeDelete", this.onGraphNodeLabelChange);
      this.controller.on("nodeDeleteAll", this.onGraphNodeLabelChange);
    }
    else
    {
      this.controller.removeEventListener("nodeDelete", this.onGraphNodeLabelChange);
      this.controller.removeEventListener("nodeDeleteAll", this.onGraphNodeLabelChange);
    }
  }

  shouldAutoRenameNodes()
  {
    return this.shouldAutoLabel;
  }

  getLabeler()
  {
    return this.labeler;
  }
}

export default MachineBuilder;
