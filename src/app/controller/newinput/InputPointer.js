import GraphPicker from './GraphPicker.js';

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

    const picker = this._controller.getPicker();
    picker.setPosition(this._x, this._y);
  }

  beginAction()
  {
    this._active = true;
    this._initialX = this._x;
    this._initialY = this._y;

    const picker = this._controller.getPicker();
    picker.setPosition(this._x, this._y);
    picker.updateTarget();
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
