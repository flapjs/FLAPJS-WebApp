import Config from 'config.js';

import Viewport from './Viewport.js';

class GraphPointer
{
  constructor(graph)
  {
    this.graph = graph;
    this.initial = {
      x: 0, y: 0,
      time: 0
    };
    this.x = 0;
    this.y = 0;

    this.moveMode = false;
    this.trashMode = false;
    this.dragging = false;
    this.active = false;
  }

  isWaitingForMoveMode()
  {
    return !this.dragging; //!this.moveMode
  }

  setInitialPosition(x, y)
  {
    this.initial.x = this.x;
    this.initial.y = this.y;
    this.initial.time = Date.now();

    this.dragging = false;
  }

  setPosition(x, y)
  {
    this.x = x;
    this.y = y;
  }

  getDraggingRadiusForTarget(targetType)
  {
    return Config.CURSOR_RADIUS_SQU + Config.DRAGGING_BUFFER_SQU;
    /*
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
      return Config.CURSOR_RADIUS_SQU + Config.DRAGGING_BUFFER_SQU;
    }
    */
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
    /*
    if (this.trashMode) return true;

    const x1 = this._trashArea.x;
    const y1 = this._trashArea.y;
    const x2 = x1 + this._trashArea.width;
    const y2 = y1 + this._trashArea.height;
    return x >= x1 && y >= y1 && x < x2 && y < y2;
    */
  }
}

export default GraphPointer;
