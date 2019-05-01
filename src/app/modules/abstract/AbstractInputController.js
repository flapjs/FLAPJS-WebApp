import AbstractInputHandler from 'deprecated/system/inputadapter/AbstractInputHandler.js';

class AbstractInputController extends AbstractInputHandler
{
  constructor(module, inputAdapter)
  {
    super();

    if (!module) throw new Error("Missing module for input controller");
    if (!inputAdapter) throw new Error("Missing inputAdapter for input controller");

    this._module = module;
    this._inputAdapter = inputAdapter;
  }

  initialize(module) {}
  destroy(module) {}
  update(module) {}

  /** @override */
  onPreInputEvent(pointer) { return false; }
  /** @override */
  onInputEvent(pointer) { return false; }
  /** @override */
  onAltInputEvent(pointer) { return this.onInputEvent(pointer); }
  /** @override */
  onDblInputEvent(pointer) { return false; }
  /** @override */
  onDragStart(pointer) { return false; }
  /** @override */
  onDragMove(pointer) { return false; }
  /** @override */
  onDragStop(pointer) { return false; }
  /** @override */
  onPostInputEvent(pointer) {}
  /** @override */
  onZoomChange(pointer, zoomValue, prevValue) { return false; }

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
