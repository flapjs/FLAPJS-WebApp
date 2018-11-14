class InputPointer
{
  constructor(controller)
  {
    this._controller = controller;

    this._active = false;
    this._x = 0;
    this._y = 0;
    this._initialX = 0;
    this._initialY = 0;

    this._scaleFactor = 0;
    this._minScale = 0.1;//MIN_SCALE
    this._maxScale = 10;//MAX_SCALE

    this._offsetX = 0;
    this._offsetY = 0;
    this._nextOffsetX = 0;
    this._nextOffsetY = 0;
    this._offsetDamping = 0.1;//SMOOTH_OFFSET_DAMPING

    this._selector = null;
    this._target = null;
  }

  get x()
  {
    return this._x;
  }

  get y()
  {
    return this._y;
  }

  transformScreenToWorld(element, clientX, clientY)
  {
    const ctm = element.getScreenCTM();
    return {
      x: (x - ctm.e) / ctm.a,
      y: (y - ctm.f) / ctm.d
    };
  }

  setPosition(x, y)
  {
    this._x = x - this._offsetX;
    this._y = y - this._offsetY;
  }

  setOffset(x, y, immediate=false)
  {
    if (immediate)
    {
      this._nextOffsetX = this._offsetX = x;
      this._nextOffsetY = this._offsetY = y;
    }
    else
    {
      this._nextOffsetX = x;
      this._nextOffsetY = y;
    }
  }

  updateOffset()
  {
    const dx = this._nextOffsetX - this._offsetX;
    this._offsetX += dx * this._offsetDamping;
    const dy = this._nextOffsetY - this._offsetY;
    this._offsetY += dy * this._offsetDamping;
  }

  update()
  {
    this.updateOffset();
  }

  updateTarget()
  {
    //Update targets...
    this._target = null;
  }

  beginAction()
  {
    this._active = true;
    this._initialX = this._x;
    this._initialY = this._y;

    this.updateTarget();

    if (this._selector.hasSelection())
    {
      //Unselect everything if clicked on something other than selectables...
      if (!this._selector.isSelectable(this._target))
      {
        this._selector.clearSelection();
      }
    }
  }

  endAction()
  {
    this._active = false;
  }

  setScale(amount)
  {
    this._scaleFactor = Math.min(this._maxScale, Math.max(this._minScale, amount));
  }

  getScale()
  {
    return this._scaleFactor;
  }

  getDistanceSquToInitial(x, y)
  {
    //If no arguments, then use pointer position
    if (arguments.length == 0)
    {
      x = this._x;
      y = this._y;
    }

    const dx = this.initialX - x;
    const dy = this.initialY - y;
    return dx * dx + dy * dy;
  }

  getDraggingRadiusSqu()
  {
    return 100;
  }

  isDragging()
  {
    return this._controller._adapter._dragging;
  }

  isActive()
  {
    return this._active;
  }
}

export default InputPointer;
