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
    this._adapter = new InputAdapter(this);

    this._pointer = new GraphPointer(this._adapter);
    this._picker = new GraphPicker(graph);

    this.prevPointerX = 0;
    this.prevPointerY = 0;

    //Make sure this is always false when moving endpoints
    this.isNewEdge = false;

    this.ghostInitialMarker = null;
    this.shouldDestroyPointlessEdges = Config.DEFAULT_SHOULD_DESTROY_POINTLESS_EDGE;

    //Swap left to right clicks and vice versa on anything else but Macs
    this._swapMouseScheme = true;//!navigator.platform.startsWith("Mac");

    this._trashMode = false;

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
    const element = app.workspace.ref;
    this._viewport.setElement(element);
    this._adapter.initialize(element);
  }

  destroy()
  {
    this._adapter.destroy();
  }

  update()
  {
    //Smooth transition offset
    this._viewport.update();

    const pointer = this._pointer;
    const picker = this._picker;
    const x = pointer.x;
    const y = pointer.y;

    if (x != this.prevPointerX || y != this.prevPointerY)
    {
      this.prevPointerX = x;
      this.prevPointerY = y;

      //Update target
      picker.updateTarget(x, y);

      //HACK: to make the cursor look like a pointer when targeting
      if (picker.hasTarget())
      {
        document.body.style.cursor = "pointer";
      }
      else
      {
        document.body.style.cursor = "auto";
      }
    }
  }

  getViewport()
  {
    return this._viewport;
  }

  setTrashMode(enabled)
  {
    this._trashMode = enabled;
  }

  isTrashMode()
  {
    return this._trashMode;
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
    return this._adapter.isDragging();
  }

  isActionMode(graphController)
  {
    return this._pointer.isActive() ?
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
