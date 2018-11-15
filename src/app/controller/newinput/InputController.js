import InputAdapter from './InputAdapter.js';
import InputPointer from './InputPointer.js';
import Viewport from './Viewport.js';

class InputController
{
  constructor()
  {
    this._adapter = new InputAdapter(this);
    this._pointer = new InputPointer(this);
    this._viewport = new Viewport();
  }

  attachToElement(element)
  {
    if (this._adapter.getElement())
    {
      this._adapter.destroy();
    }

    this._viewport.setElement(element);
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

  getViewport()
  {
    return this._viewport;
  }

  getAdapter()
  {
    return this._adapter;
  }
}

export default InputController;
