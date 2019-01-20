import AbstractInputHandler from 'system/inputadapter/AbstractInputHandler.js';

import ViewportInputHandler from './ViewportInputHandler.js';

class AbstractModuleInputController extends AbstractInputHandler
{
  constructor(module, inputAdapter)
  {
    super();

    if (!module) throw new Error("Missing module for input controller");
    if (!inputAdapter) throw new Error("Missing inputAdapter for input controller");

    this._module = module;
    this._inputAdapter = inputAdapter.addInputHandler(this);

    this._viewportInputHandler = new ViewportInputHandler();
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
  onDragStart(pointer) { return this._viewportInputHandler.onDragStart(pointer); }
  //Override
  onDragMove(pointer) { return this._viewportInputHandler.onDragMove(pointer); }
  //Override
  onDragStop(pointer) { return this._viewportInputHandler.onDragStop(pointer); }
  //Override
  onPostInputEvent(pointer) {}
  //Override
  onZoomChange(pointer, zoomValue, prevValue) { return this._viewportInputHandler.onZoomChange(pointer, zoomValue, prevValue); }

  getInputAdapter()
  {
    return this._inputAdapter;
  }

  getModule()
  {
    return this._module;
  }
}

export default AbstractModuleInputController;
