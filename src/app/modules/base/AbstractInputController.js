class AbstractInputController
{
  constructor(module, adapter)
  {
    this._module = module;
    this._adapter = adapter.setController(this);
  }

  initialize(app) {}
  destroy(app) {}
  update(app) {}

  //Override
  onPreInputEvent(pointer) { return false; }
  //Override
  onInputEvent(pointer) { return false; }
  //Override
  onAltInputEvent(pointer) { return this.onInputEvent(pointer); }
  //Override
  onDblInputEvent(pointer) { return false; }
  //Override
  onDragStart(pointer) { return false; }
  //Override
  onDragMove(pointer) { return false; }
  //Override
  onDragStop(pointer) { return false; }
  //Override
  onPostInputEvent(pointer) {}
  //Override
  onZoomChange(pointer, zoomValue, prevValue) { return true; }

  getInputAdapter()
  {
    return this._adapter;
  }

  getModule()
  {
    return this._module;
  }
}

export default InputController;
