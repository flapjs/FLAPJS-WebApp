import Config from 'config.js';

const DEFAULT_AUTO_RENAME = true;

class MachineBuilder
{
  constructor()
  {
    this.graph = null;
    this.graphController = null;

    this.shouldAutoLabel = false;
    this.onGraphNodeLabelChange = this.onGraphNodeLabelChange.bind(this);
  }

  initialize(module)
  {
    this.graphController = module.getGraphController();
    this.graph = this.graphController.getGraph();

    this.setAutoRenameNodes(DEFAULT_AUTO_RENAME);
  }

  destroy()
  {

  }

  onGraphNodeLabelChange(graph, node, targetNodes, prevX, prevY)
  {
    this.graphController.applyAutoRename();
  }

  setAutoRenameNodes(enable)
  {
    const prev = this.shouldAutoLabel;
    this.shouldAutoLabel = enable;
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
    return this.shouldAutoLabel;
  }
}

export default MachineBuilder;
