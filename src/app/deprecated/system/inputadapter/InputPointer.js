/**
 * Used by InputAdapter to hold input event data.
 */
class InputPointer
{
  constructor(adapter, element, viewport)
  {
    this._adapter = adapter;
    this._element = element;
    this._viewport = viewport;

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
    return this;
  }

  beginInput()
  {
    this._active = true;
    this._inputpos.x = this._x;
    this._inputpos.y = this._y;
  }

  /**
   * Returns the position which the input began at. This is mutable.
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

  /**
   * The DOM element for which this pointer provides context for; this should be
   * the same element as in the input adapter.
   */
  getElement()
  {
    return this._element;
  }

  /**
   * The viewport for this pointer operates within; this should be the same
   * viewport as in the input adapter.
   */
  getViewportAdapter()
  {
    return this._viewport;
  }

  /**
   * The input adapter that controls this pointer's properties
   */
  getInputAdapter()
  {
    return this._adapter;
  }
}

export default InputPointer;
