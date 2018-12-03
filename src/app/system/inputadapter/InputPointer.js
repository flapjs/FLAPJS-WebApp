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

    this._inputpos = {x: 0, y: 0};
  }

  get x() { return this._x; }
  get y() { return this._y; }

  setPosition(x, y)
  {
    this._x = x;
    this._y = y;
  }

  beginInput()
  {
    this._active = true;
    this._inputpos.x = this._x;
    this._inputpos.y = this._y;
  }

  /**
   * Returns the position which the input began at. This is not immutable.
   */
  getInputEventPosition()
  {
    return this._inputpos;
  }

  changeInputEventPosition(x, y)
  {
    this._inputpos.x = x;
    this._inputpos.y = y;
  }

  endInput()
  {
    this._active = false;
  }

  isActive()
  {
    return this._active;
  }

  getDistanceSquToInitial()
  {
    const pos = this._inputpos;
    const dx = pos.x - this._x;
    const dy = pos.y - this._y;
    return dx * dx + dy * dy;
  }
}

export default InputPointer;
