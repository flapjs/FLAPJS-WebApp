class InputController
{
  constructor()
  {
    this._adapter = new InputAdapter(this);
    this._pointer = new InputPointer(this);
  }

  attachToElement(element)
  {
    if (this._adapter.getElement())
    {
      this._adapter.destroy();
    }

    this._adapter.initialize(element);
  }

  onPreActionEvent(pointer)
  {
    return false;
  }

  onActionEvent(pointer)
  {
    return false;
  }

  onAltActionEvent(pointer)
  {
    return false;
  }

  onDblActionEvent(pointer)
  {
    return false;
  }

  onDragStart(pointer)
  {
    return false;
  }

  onDragMove(pointer)
  {

  }

  onDragStop(pointer)
  {

  }

  onZoomChange(pointer, zoomValue, prevValue)
  {
    return true;
  }

  getPointer()
  {
    return this._pointer;
  }

  getAdapter()
  {
    return this._adapter;
  }
}

export default InputController;
