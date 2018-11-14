import Config from 'config.js';

import GraphPicker from './GraphPicker.js';

const BOUNDING_RECT_UPDATE_INTERVAL = 100;

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

    this.offsetX = 0;
    this.offsetY = 0;
    this.nextOffsetX = 0;
    this.nextOffsetY = 0;

    this.scale = 1;

    this.picker = new GraphPicker(this.graph);

    this.moveMode = false;
    this.trashMode = false;
    this.dragging = false;
    this.active = false;
  }

  setOffset(x, y, immediate=false)
  {
    if (immediate)
    {
      this.nextOffsetX = this.offsetX = x;
      this.nextOffsetY = this.offsetY = y;
    }
    else
    {
      this.nextOffsetX = x;
      this.nextOffsetY = y;
    }
  }

  updateOffset()
  {
    const dx = this.nextOffsetX - this.offsetX;
    this.offsetX += dx * Config.SMOOTH_OFFSET_DAMPING;
    const dy = this.nextOffsetY - this.offsetY;
    this.offsetY += dy * Config.SMOOTH_OFFSET_DAMPING;
  }

  setScale(scale)
  {
    this.scale = Math.min(Config.MAX_SCALE, Math.max(Config.MIN_SCALE, scale));
  }

  isWaitingForMoveMode()
  {
    return !this.dragging; //!this.moveMode
  }

  setInitialPosition(x, y)
  {
    this.initial.x = this.x = x - this.offsetX;
    this.initial.y = this.y = y - this.offsetY;
    this.initial.time = Date.now();

    this.updateTarget();
    this.setInitialTarget(this.picker.target, this.picker.targetType);

    this.dragging = false;
  }

  setPosition(x, y)
  {
    this.x = x - this.offsetX;
    this.y = y - this.offsetY;
  }

  updateTarget()
  {
    this.picker.updateTarget(this.x, this.y);
  }

  clearTarget()
  {
    this.picker.target = null;
    this.picker.targetType = "none";
  }

  isTarget(target)
  {
    return this.picker.target === target;
  }

  setInitialTarget(target, type)
  {
    this.picker.initialTarget = target;
    this.picker.initialTargetType = type;
  }

  hasTarget()
  {
    return this.picker.target != null;
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

  getPicker()
  {
    return this.picker;
  }
}

export default GraphPointer;
