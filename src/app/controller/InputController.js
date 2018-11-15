import Config from 'config.js';

import Eventable from 'util/Eventable.js';

import GraphPointer from './GraphPointer.js';
import GraphPicker from './GraphPicker.js';
import InputAdapter from './InputAdapter.js';
import Viewport from './Viewport.js';

const PINCH_SENSITIVITY = 1 / 300.0;

class InputController
{
  constructor(graph)
  {
    this._viewport = new Viewport().setMinScale(Config.MIN_SCALE).setMaxScale(Config.MAX_SCALE).setOffsetDamping(Config.SMOOTH_OFFSET_DAMPING);
    this._pointer = new GraphPointer(graph);
    this._picker = new GraphPicker(graph);

    this._adapter = new InputAdapter(this);

    //Swap left to right clicks and vice versa on anything else but Macs
    this._swapMouseScheme = true;//!navigator.platform.startsWith("Mac");

    //inputdown(input, x, y, target, targetType, event) - Called when input is starting touch/press/click
    //event.result can be changed to decide whether to continue to process future related events
    //by default, it is true
    this.registerEvent("inputdown");
    //inputmove(input, x, y, target, targetType) - Called when input moves
    this.registerEvent("inputmove");
    //inputup(input, x, y, target, targetType) - Called when input is released
    this.registerEvent("inputup");
    //inputaction(input, x, y, target, targetType) - Called when input is completed
    this.registerEvent("inputaction");
    //dragstart(input, x, y, target, targetType) - Called when a drag begins
    this.registerEvent("dragstart");
    //dragmove(input, x, y, target, targetType) - Called when a drag moves
    this.registerEvent("dragmove");
    //dragstop(input, x, y, target, targetType) - Called when a drag finishes
    this.registerEvent("dragstop");
  }

  initialize(app)
  {
    this._viewport.setElement(app.workspace.ref);

    this._adapter.initialize(app);
  }

  destroy()
  {
    this._adapter.destroy();
  }

  update()
  {
    //Smooth transition offset
    this._viewport.update();
  }

  getViewport()
  {
    return this._viewport;
  }

  setTrashMode(enabled)
  {
    this._pointer.trashMode = enabled;
  }

  isTrashMode()
  {
    return this._pointer.trashMode;
  }

  setInputScheme(shouldActionFirst)
  {
    this._swapMouseScheme = !shouldActionFirst;
  }

  getInputScheme()
  {
    return this._swapMouseScheme;
  }

  isDragging()
  {
    return this._pointer.dragging;
  }

  isActionMode(graphController)
  {
    return this._pointer.active ?
      //Is considered an action when NOT moving or when creating a new edge...
      graphController.isNewEdge || !this._pointer.moveMode :
      //If not active, just show default action...
      !this._swapMouseScheme;
  }

  getPointer()
  {
    return this._pointer;
  }

  getPicker()
  {
    return this._picker;
  }

  isUsingTouch()
  {
    return this._adapter._cursor._touchmove || this._adapter._cursor._touchend;
  }
}
//Mixin Eventable
Eventable.mixin(InputController);

export default InputController;
