
class GraphPointer
{
  constructor(adapter)
  {
    this._adapter = adapter;

    this._active = false;
    this._x = 0;
    this._y = 0;
    this._initialX = 0;
    this._initialY = 0;

    this.moveMode = false;
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
    this._active = true;
  }

  endAction()
  {
    this._active = false;
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

  isDragging()
  {
    return this._adapter.isDragging();
  }

  isActive()
  {
    return this._active;
  }
}

export default GraphPointer;
