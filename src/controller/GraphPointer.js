import * as Config from 'config.js';

const MIN_SCALE = 0.1;
const MAX_SCALE = 10;
const BOUNDING_RECT_UPDATE_INTERVAL = 100;

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

    this.offsetX = 0;
    this.offsetY = 0;

    this._boundingRect = null;
    this._boundingRectTime = 0;
    this.scale = 1;

    this.target = null;
    this.targetType = null;

    this.moveMode = false;
    this.trashMode = false;
    this.dragging = false;
  }

  setScale(scale)
  {
    //Add delay to this so it is not called every frame
    if (Date.now() - this._boundingRectTime > BOUNDING_RECT_UPDATE_INTERVAL)
    {
      this._boundingRect = this.graph.getBoundingRect();
      this._boundingRectTime = Date.now();
    }

    const rect = this._boundingRect;
    //const dw = (Math.max(Config.DEFAULT_GRAPH_SIZE, rect.width)) / Config.DEFAULT_GRAPH_SIZE;
    //const dh = (Math.max(Config.DEFAULT_GRAPH_SIZE, rect.height)) / Config.DEFAULT_GRAPH_SIZE;
    this.scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
  }

  isWaitingForMoveMode()
  {
    return !this.moveMode && !this.dragging;
  }

  setInitialPosition(x, y)
  {
    this.initial.x = this.x = x - this.offsetX;
    this.initial.y = this.y = y - this.offsetY;
    this.initial.time = Date.now();

    this.updateTarget();
    this.initial.target = this.target;
    this.initial.targetType = this.targetType;

    this.dragging = false;
  }

  setPosition(x, y)
  {
    this.x = x - this.offsetX;
    this.y = y - this.offsetY;
  }

  updateTarget()
  {
    if (this.target = this.getNodeByInitialMarkerAt())
    {
      //Clicked on initial marker
      this.targetType = "initial";
    }
    else if (this.target = this.getEdgeByEndPointAt())
    {
      //Clicked on endpoint
      this.targetType = "endpoint";
    }
    else if (this.target = this.getNodeAt())
    {
      //Clicked on node
      this.targetType = "node";
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

  getNodeByInitialMarkerAt(x, y)
  {
    //If no arguments, then use pointer position
    if (arguments.length == 0)
    {
      x = this.x;
      y = this.y;
    }

    const startNode = this.graph.getStartNode();
    if (!startNode) return null;

    const dx = x - (startNode.x + Config.INITIAL_MARKER_OFFSET_X);
    const dy = y - startNode.y;
    if (dx * dx + dy * dy < Config.CURSOR_RADIUS_SQU)
    {
      return startNode;
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
      const dx = x - point.x;
      const dy = y - point.y;
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

    if (targetType === 'node')
    {
      return Config.NODE_RADIUS_SQU + Config.DRAGGING_BUFFER_SQU;
    }
    else if (targetType == "edge")
    {
      return Config.EDGE_RADIUS_SQU + Config.DRAGGING_BUFFER_SQU;
    }
    else if (targetType == "endpoint")
    {
      return Config.ENDPOINT_RADIUS_SQU + Config.DRAGGING_BUFFER_SQU;
    }
    else if (targetType === 'initial')
    {
      return Config.CURSOR_RADIUS_SQU + Config.DRAGGING_BUFFER_SQU;
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

  isMoveMode()
  {
    return this.moveMode;
  }

  isTrashMode(x, y)
  {
    return this.trashMode;
  }
}

export default GraphPointer;
