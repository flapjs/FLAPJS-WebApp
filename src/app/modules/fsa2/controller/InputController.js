import AbstractInputController from 'modules/abstract/AbstractInputController.js';

class InputController extends AbstractInputController
{
  constructor(module, inputAdapter)
  {
    super(module, inputAdapter);

    this._graphController = null;

    this._disabled = false;
  }

  //Override
  initialize(module)
  {
    super.initialize(module);

    this._graphController = module.getGraphController();
  }

  //Override
  destroy(module)
  {
    super.destroy(module);
  }

  //Override
  update(module)
  {
    super.update(module);
  }

  //Override
  onPreInputEvent(pointer)
  {
    if (this._disabled) return super.onPreInputEvent(pointer);
    const inputController = this;
    const graphController = this._graphController;
  }

  //Override
  onPostInputEvent(pointer)
  {
    if (this._disabled) return super.onPostInputEvent(pointer);
    const inputController = this;
    const graphController = this._graphController;
  }

  //Override
  onInputEvent(pointer)
  {
    if (this._disabled) return super.onInputEvent(pointer);
    const inputController = this;
    const graphController = this._graphController;
  }

  //Override
  onDblInputEvent(pointer)
  {
    if (this._disabled) return super.onDblInputEvent(pointer);
    const inputController = this;
    const graphController = this._graphController;
  }

  //Override
  onDragStart(pointer)
  {
    if (this._disabled) return super.onDragStart(pointer);
    const inputController = this;
    const graphController = this._graphController;
  }

  //Override
  onDragMove(pointer)
  {
    if (this._disabled) return super.onDragMove(pointer);
    const inputController = this;
    const graphController = this._graphController;
  }

  //Override
  onDragStop(pointer)
  {
    if (this._disabled) return super.onDragStop(pointer);
    const inputController = this;
    const graphController = this._graphController;
  }

  isDragging()
  {
    return this._inputAdapter.isDragging();
  }

  setDisabled(disabled)
  {
    this._disabled = disabled;
  }

  isDisabled()
  {
    return this._disabled;
  }
}

export default InputController;
