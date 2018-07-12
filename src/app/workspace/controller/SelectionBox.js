class SelectionBox
{
  constructor(graph)
  {
    this.graph = graph;
    this.targets = [];
    this.beginX = 0;
    this.beginY = 0;
    this.endX = 0;
    this.endY = 0;
    this.active = false;
  }

  beginSelection(x, y)
  {
    this.active = true;
    this.beginX = this.endX = x;
    this.beginY = this.endY = y;
    this.clearSelection();
  }

  updateSelection(x, y)
  {
    this.endX = x;
    this.endY = y;
    this.getSelection(true);
  }

  endSelection(x, y)
  {
    this.endX = x;
    this.endY = y;
    this.getSelection(true);
    this.active = false;
  }

  isTargetSelected(target)
  {
    return this.targets.includes(target);
  }

  getSelection(forceUpdate=false)
  {
    if (forceUpdate)
    {
      const mx = Math.max(this.toX, this.fromX);
      const my = Math.max(this.toY, this.fromY);
      const lx = Math.min(this.toX, this.fromX);
      const ly = Math.min(this.toY, this.fromY);
      this.clearSelection();
      getNodesWithin(this.graph, lx, ly, mx, my, this.targets);
    }

    return this.targets;
  }

  hasSelection()
  {
    return this.targets.length > 0;
  }

  clearSelection()
  {
    this.targets.length = 0;
  }

  isActive()
  {
    return this.active;
  }
}

function getNodesWithin(graph, x1, y1, x2, y2, dst)
{
  const fromX = Math.min(x1, x2);
  const fromY = Math.min(y1, y2);
  const toX = Math.max(x1, x2);
  const toY = Math.max(y1, y2);

  for(const node of graph.nodes)
  {
    if (node.x >= fromX && node.x < toX &&
        node.y >= fromY && node.y < toY)
    {
      dst.push(node);
    }
  }
  return dst;
}

export default SelectionBox;
