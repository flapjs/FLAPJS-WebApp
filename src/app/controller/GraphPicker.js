import Config from 'config.js';

class GraphPicker
{
  constructor(graph)
  {
    this.graph = graph;
    this.selectionBox = {
      fromX: 0, fromY: 0,
      toX: 0, toY: 0,
      visible: false
    };
    this.targets = [];

    this.target = null;
    this.targetType = "";

    this.initialTarget = null;
    this.initialTargetType = "";
  }

  setInitialTarget(target, type)
  {
    this.initialTarget = target;
    this.initialTargetType = type;
  }

  updateTarget(x, y)
  {
    if (this.target = this.getNodeByInitialMarkerAt(x, y))
    {
      //Clicked on initial marker
      this.targetType = "initial";
    }
    else if (this.target = this.getEdgeByEndPointAt(x, y))
    {
      //Clicked on endpoint
      this.targetType = "endpoint";
    }
    else if (this.target = this.getNodeAt(x, y))
    {
      //Clicked on node
      this.targetType = "node";
    }
    else if (this.target = this.getEdgeAt(x, y))
    {
      //Clicked on edge
      this.targetType = "edge";
    }
    else
    {
      //Clicked on graph
      this.target = null;
      this.targetType = "none";
    }

    return this.target;
  }

  clearTarget()
  {
    this.target = null;
    this.targetType = "none";
  }

  hasTarget()
  {
    return this.target != null;
  }

  getNodeAt(x, y)
  {
    //If no arguments, then use pointer position
    if (arguments.length == 0)
    {
      x = this.x;
      y = this.y;
    }

    //Search graph
    for(const node of this.graph.nodes)
    {
      const dx = x - node.x;
      const dy = y - node.y;
      if (dx * dx + dy * dy < Config.NODE_RADIUS_SQU)
      {
        return node;
      }
    }
    return null;
  }

  getNodeByInitialMarkerAt(x, y)
  {
    const startNode = this.graph.getStartNode();
    if (!startNode) return null;

    const dx = x - (startNode.x + Config.INITIAL_MARKER_OFFSET_X);
    const dy = y - startNode.y;
    if (dx * dx + dy * dy < Config.EDGE_RADIUS_SQU)
    {
      return startNode;
    }

    return null;
  }

  getEdgeAt(x, y)
  {
    //Search graph
    for(const edge of this.graph.edges)
    {
      const dx = x - edge.x;
      const dy = y - edge.y;
      if (dx * dx + dy * dy < Config.EDGE_RADIUS_SQU)
      {
        return edge;
      }
    }
    return null;
  }

  getEdgeByEndPointAt(x, y)
  {
    //Search graph
    for(const edge of this.graph.edges)
    {
      const point = edge.getEndPoint();
      const dx = x - point.x;
      const dy = y - point.y;
      if (dx * dx + dy * dy < Config.ENDPOINT_RADIUS_SQU)
      {
        return edge;
      }
    }
    return null;
  }

  getSelectionBox()
  {
    return this.selectionBox;
  }

  getSelection(forceUpdate=false)
  {
    if (forceUpdate)
    {
      const box = this.selectionBox;
      const mx = Math.max(box.toX, box.fromX);
      const my = Math.max(box.toY, box.fromY);
      const lx = Math.min(box.toX, box.fromX);
      const ly = Math.min(box.toY, box.fromY);
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

  isTargetInSelection(target)
  {
    return this.targets.includes(target || this.target);
  }

  beginSelection(x, y)
  {
    const box = this.selectionBox;
    box.fromX = box.toX = x;
    box.fromY = box.toY = y;
    this.clearSelection();

    box.visible = true;
  }

  updateSelection(x, y)
  {
    const box = this.selectionBox;
    box.toX = x;
    box.toY = y;
    this.getSelection(true);
  }

  endSelection(x, y)
  {
    const box = this.selectionBox;
    box.toX = x;
    box.toY = y;
    this.getSelection(true);

    box.visible = false;
  }

  isSelecting()
  {
    return this.selectionBox.visible;
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

export default GraphPicker;
