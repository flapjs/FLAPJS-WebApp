class AbstractInputController
{
  constructor(module, inputAdapter)
  {
    this._module = module;
    this._inputAdapter = inputAdapter.setController(this);
  }

  initialize(module) {}
  destroy(module) {}
  update(module) {}

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
    return this._inputAdapter;
  }

  getModule()
  {
    return this._module;
  }
}

export default AbstractInputController;
