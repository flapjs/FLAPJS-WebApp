import * as Config from 'config.js';

class GraphPointer
{
  constructor(graph)
  {
    this.graph = graph;
    this.initial = {
      x: 0, y: 0,
      time: 0,
      target: null,
      targetType: null
    };
    this.x = 0;
    this.y = 0;

    this.target = null;
    this.targetType = null;

    this.moveMode = false;
    this.dragging = false;
  }

  setInitialPosition(x, y)
  {
    this.initial.x = this.x = x;
    this.initial.y = this.y = y;
    this.initial.time = Date.now();

    this.updateTarget();
    this.initial.target = this.target;
    this.initial.targetType = this.targetType;

    this.dragging = false;
  }

  setPosition(x, y)
  {
    this.x = x;
    this.y = y;
  }

  updateTarget()
  {
    if (this.target = this.getNodeAt())
    {
      //Clicked on node
      this.targetType = "node";
    }
    else if (this.target = this.getEdgeByEndPointAt())
    {
      //Clicked on endpoint
      this.targetType = "endpoint";
    }
    else if (this.target = this.getEdgeAt())
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

  getEdgeAt(x, y)
  {
    //If no arguments, then use pointer position
    if (arguments.length == 0)
    {
      x = this.x;
      y = this.y;
    }

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
    //If no arguments, then use pointer position
    if (arguments.length == 0)
    {
      x = this.x;
      y = this.y;
    }

    //Search graph
    for(const edge of this.graph.edges)
    {
      const point = edge.getEndPoint();
      const dx = x - point[0];
      const dy = y - point[1];
      if (dx * dx + dy * dy < Config.ENDPOINT_RADIUS_SQU)
      {
        return edge;
      }
    }
    return null;
  }

  getDraggingRadiusForTarget(targetType)
  {
    //If no arguments, then use pointer targetType
    if (arguments.length == 0)
    {
      targetType = this.targetType;
    }

    if (targetType == "node")
    {
      return Config.NODE_RADIUS_SQU;
    }
    else if (targetType == "edge")
    {
      return Config.EDGE_RADIUS_SQU;
    }
    else if (targetType == "endpoint")
    {
      return Config.ENDPOINT_RADIUS_SQU;
    }
    else
    {
      return Config.CURSOR_RADIUS_SQU;
    }
  }

  getDistanceSquToInitial(x, y)
  {
    //If no arguments, then use pointer position
    if (arguments.length == 0)
    {
      x = this.x;
      y = this.y;
    }

    const dx = this.initial.x - x;
    const dy = this.initial.y - y;
    return dx * dx + dy * dy;
  }

  getElapsedTimeSinceInitial()
  {
    return Date.now() - this.initial.time;
  }
}

export default GraphPointer;
