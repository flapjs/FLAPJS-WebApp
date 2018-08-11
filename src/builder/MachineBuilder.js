import Config from 'config.js';

class MachineBuilder
{
  //HACK: this should not take app
  constructor(graph, app)
  {
    this.graph = graph;
    this.controller = app.controller;

    this.shouldAutomaticallyRenameNodes = true;
    this.sortDefaultNodeLabels = this.sortDefaultNodeLabels.bind(this);

    this.controller.on("nodeDelete", this.sortDefaultNodeLabels);
    this.controller.on("nodeDeleteAll", this.sortDefaultNodeLabels);
    this.controller.on("nodeInitial", this.sortDefaultNodeLabels);
    this.controller.on("nodeLabel", this.sortDefaultNodeLabels);
  }

  sortDefaultNodeLabels()
  {
    if (!this.shouldAutomaticallyRenameNodes) return;

    const startNode = this.graph.getStartNode();
    if (!startNode) return;
    const isDefaultInitial = !startNode.hasCustomLabel();

    const defaultNodes = [];
    const customLabels = [];
    for(const node of this.graph.nodes)
    {
      if (node.hasCustomLabel())
      {
        customLabels.push(node.label);
      }
      else
      {
        defaultNodes.push(node);
      }
    }

    let index = isDefaultInitial ? 0 : 1;
    for(const node of defaultNodes)
    {
      let defaultName = null;
      while(customLabels.includes(
        defaultName = this.getDefaultNodeLabelByIndex(index++))) {}

      node.setLabel(defaultName);
    }
  }

  getNextDefaultNodeLabel()
  {
    let nodeIndex = 0;
    let result = this.getDefaultNodeLabelByIndex(nodeIndex);
    while(!this.isUniqueNodeLabel(result))
    {
      ++nodeIndex;
      result = this.getDefaultNodeLabelByIndex(nodeIndex);
    }
    return result;
  }

  getDefaultNodeLabelByIndex(index)
  {
    return Config.STR_STATE_LABEL + (index);
  }

  isUniqueNodeLabel(newLabel)
  {
    for(const node of this.graph.nodes)
    {
      if (node.label == newLabel)
      {
        return false;
      }
    }

    return true;
  }
}

export default MachineBuilder;
