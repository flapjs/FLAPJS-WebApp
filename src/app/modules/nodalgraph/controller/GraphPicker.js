const EDGE_RADIUS = 12;
const EDGE_RADIUS_SQU = EDGE_RADIUS * EDGE_RADIUS;
const ENDPOINT_RADIUS = 6;
const ENDPOINT_RADIUS_SQU = ENDPOINT_RADIUS * ENDPOINT_RADIUS;

class GraphPicker
{
  constructor(graphController)
  {
    this.target = null;
    this.targetType = "";

    this.initialTarget = null;
    this.initialTargetType = "";

    this._prevX = 0;
    this._prevY = 0;
  }

  setInitialTarget(target, type)
  {
    this.initialTarget = target;
    this.initialTargetType = type;
  }

  updateHoverTarget(graph, x, y)
  {
    if (this._prevX !== x || this._prevY !== y)
    {
      this._prevX = x;
      this._prevY = y;

      //Update target
      this.updateTarget(graph, x, y);

      //HACK: to make the cursor look like a pointer when targeting
      if (this.hasTarget())
      {
        document.body.style.cursor = "pointer";
      }
      else
      {
        document.body.style.cursor = "auto";
      }
    }
  }

  updateInitialTarget(graph, x, y)
  {
    this.updateTarget(graph, x, y);
    this.setInitialTarget(this.target, this.targetType);
  }

  updateTarget(graph, x, y)
  {
    if (this.target = this.getNodeByInitialMarkerAt(graph, x, y))
    {
      //Clicked on initial marker
      this.targetType = "initial";
    }
    else if (this.target = this.getEdgeByEndPointAt(graph, x, y))
    {
      //Clicked on endpoint
      this.targetType = "endpoint";
    }
    else if (this.target = this.getNodeAt(graph, x, y))
    {
      //Clicked on node
      this.targetType = "node";
    }
    else if (this.target = this.getEdgeAt(graph, x, y))
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

  getNodeAt(graph, x, y)
  {
    //Search graph
    for(const node of graph.getNodes())
    {
      const nodeSize = node.getNodeSize();
      const dx = x - node.x;
      const dy = y - node.y;
      if (dx * dx + dy * dy < nodeSize * nodeSize)
      {
        return node;
      }
    }
    return null;
  }

  getNodeByInitialMarkerAt(graph, x, y)
  {
    const startNode = graph.getStartNode();
    if (!startNode) return null;

    const nodeSize = startNode.getNodeSize();
    const offset = -(nodeSize + (nodeSize / 2));
    const dx = x - (startNode.x + offset);
    const dy = y - startNode.y;
    if (dx * dx + dy * dy < EDGE_RADIUS_SQU)
    {
      return startNode;
    }

    return null;
  }

  getEdgeAt(graph, x, y)
  {
    const center = {x: 0, y: 0};

    //Search graph
    for(const edge of graph.getEdges())
    {
      edge.getCenterPoint(center);
      const dx = x - center.x;
      const dy = y - center.y;
      if (dx * dx + dy * dy < EDGE_RADIUS_SQU)
      {
        return edge;
      }
    }
    return null;
  }

  getEdgeByEndPointAt(graph, x, y)
  {
    const end = {x: 0, y: 0};
    //Search graph
    for(const edge of graph.getEdges())
    {
      edge.getEndPoint(end);
      const dx = x - end.x;
      const dy = y - end.y;
      if (dx * dx + dy * dy < ENDPOINT_RADIUS_SQU)
      {
        return edge;
      }
    }
    return null;
  }


  isTarget(target)
  {
    return this.target == target;
  }
}

export default GraphPicker;
