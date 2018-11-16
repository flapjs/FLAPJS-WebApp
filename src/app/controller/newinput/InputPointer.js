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

    this._actionpos = {x: 0, y: 0};
  }

  get x() { return this._x; }
  get y() { return this._y; }

  setPosition(x, y)
  {
    this._x = x;
    this._y = y;
  }

  beginAction()
  {
    this._active = true;
    this._actionpos.x = this._x;
    this._actionpos.y = this._y;
  }

  /**
   * Returns the position which the action began at. This is not immutable.
   */
  getActionPosition()
  {
    return this._actionpos;
  }

  changeActionPosition(x, y)
  {
    this._actionpos.x = x;
    this._actionpos.y = y;
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
    const pos = this._actionpos;
    const dx = pos.x - this._x;
    const dy = pos.y - this._y;
    return dx * dx + dy * dy;
  }
}

export default InputPointer;
