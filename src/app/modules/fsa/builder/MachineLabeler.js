import Config from 'config.js';

class MachineLabeler
{
  constructor(graph)
  {
    this.graph = graph;
    this.prefix = Config.STR_STATE_LABEL;

    //TODO: this is hooked into the controller in App.js
    this.shouldAutoLabel = false;
  }

  sortDefaultNodeLabels()
  {
    const startNode = this.graph.getStartNode();
    if (!startNode) return;
    const isDefaultInitial = !startNode.getNodeCustom();

    const defaultNodes = [];
    const customLabels = [];
    for(const node of this.graph.nodes)
    {
      if (node.getNodeCustom())
      {
        customLabels.push(node.getNodeLabel());
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

      node.setNodeLabel(defaultName);
    }
  }

  getNextDefaultNodeLabel()
  {
    //if (!this.shouldAutoLabel) return this.prefix;

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
    return this.prefix + (index);
  }

  isUniqueNodeLabel(newLabel)
  {
    for(const node of this.graph.nodes)
    {
      if (node.getNodeLabel() == newLabel)
      {
        return false;
      }
    }

    return true;
  }
}

export default MachineLabeler;
