/**
 * Used by InputAdapter to hold input event data.
 */
class InputPointer
{
  constructor()
  {
    this._active = false;
    this._x = 0;
    this._y = 0;
    this._initialX = 0;
    this._initialY = 0;
  }

  get x() { return this._x; }
  get y() { return this._y; }

  setPosition(x, y)
  {
    this._x = x;
    this._y = y;
  }

  getInitialX() { return this._initialX; }
  getInitialY() { return this._initialY; }

  setInitialPosition(x, y)
  {
    this._initialX = x;
    this._initialY = y;
  }

  beginAction()
  {
    this._active = true;
    this._initialX = this._x;
    this._initialY = this._y;
  }

  endAction()
  {
    this._active = false;
  }

  isActive()
  {
    return this._active;
  }

  getDistanceSquToInitial()
  {
    const dx = this._initialX - this._x;
    const dy = this._initialY - this._y;
    return dx * dx + dy * dy;
  }
}

export default InputPointer;
