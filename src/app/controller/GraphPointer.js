import Config from 'config.js';

import Viewport from './Viewport.js';

class GraphPointer
{
  constructor(graph)
  {
    this.graph = graph;
    this._x = 0;
    this._y = 0;
    this._initialX = 0;
    this._initialY = 0;

    this.moveMode = false;
    this.trashMode = false;
    this.dragging = false;
    this._active = false;
  }

  get x()
  {
    return this._x;
  }

  get y()
  {
    return this._y;
  }

  setPosition(x, y)
  {
    this._x = x;
    this._y = y;
  }

  getInitialX()
  {
    return this._initialX;
  }

  getInitialY()
  {
    return this._initialY;
  }

  setInitialPosition(x, y)
  {
    this._initialX = x;
    this._initialY = y;
  }

  beginAction()
  {
    this.setInitialPosition(this._x, this._y);
    this.dragging = false;
    this._active = true;
  }

  endAction()
  {
    this._active = false;
  }

  isWaitingForMoveMode()
  {
    return !this.dragging; //!this.moveMode
  }

  getDraggingRadiusForTarget(targetType)
  {
    return Config.CURSOR_RADIUS_SQU + Config.DRAGGING_BUFFER_SQU;
  }

  getDistanceSquToInitial(x, y)
  {
    //If no arguments, then use pointer position
    if (arguments.length == 0)
    {
      x = this._x;
      y = this._y;
    }

    const dx = this._initialX - x;
    const dy = this._initialY - y;
    return dx * dx + dy * dy;
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

  isActive()
  {
    return this._active;
  }
}

export default GraphPointer;
