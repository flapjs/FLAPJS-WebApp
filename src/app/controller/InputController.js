import Config from 'config.js';

import InputAdapter from './input/InputAdapter.js';
import Viewport from './input/Viewport.js';

import GraphPicker from './GraphPicker.js';

import InputDownHandler from './handlers/InputDownHandler.js';
import ActionHandler from './handlers/ActionHandler.js';
import DragStartHandler from './handlers/DragStartHandler.js';
import DragStopHandler from './handlers/DragStopHandler.js';
import DragMoveHandler from './handlers/DragMoveHandler.js';

class InputController
{
  constructor(graph)
  {
    this._viewport = new Viewport()
      .setMinScale(Config.MIN_SCALE)
      .setMaxScale(Config.MAX_SCALE)
      .setOffsetDamping(Config.SMOOTH_OFFSET_DAMPING);

    this._inputAdapter = new InputAdapter()
      .setController(this);

    this._graphController = null;

    this.inputDownHandler = null;
    this.actionHandler = null;
    this.dragStartHandler = null;
    this.dragStopHandler = null;
    this.dragMoveHandler = null;

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
  }

  initialize(app)
  {
    const element = app.workspace.ref;
    this._viewport.setElement(element);
    this._graphController = app.graphController;

    this.inputDownHandler = new InputDownHandler(this, this._graphController);
    this.actionHandler = new ActionHandler(this, this._graphController);
    this.dragStartHandler = new DragStartHandler(this, this._graphController);
    this.dragStopHandler = new DragStopHandler(this, this._graphController);
    this.dragMoveHandler = new DragMoveHandler(this, this._graphController);

    this._inputAdapter.initialize(element, this._viewport);
  }

  destroy()
  {
    this._inputAdapter.destroy();
  }

  update()
  {
    //Smooth transition offset
    this._viewport.update();

    const pointer = this._inputAdapter.getPointer();
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

  //Override
  onPreActionEvent(pointer)
  {
    const inputController = this;
    const picker = inputController.getPicker();

    picker.updateTarget(pointer.x, pointer.y);
    picker.setInitialTarget(picker.target, picker.targetType);

    return this.inputDownHandler.onEvent(pointer);
  }

  //Override
  onActionEvent(pointer)
  {
    return this.actionHandler.onEvent(pointer);
  }

  //Override
  onAltActionEvent(pointer)
  {
    return this.onActionEvent(pointer);
  }

  //Override
  onDblActionEvent(pointer)
  {
    const graphController = this._graphController;
    const x = pointer.x;
    const y = pointer.y;

    if (!this.isTrashMode())
    {
      //Create state at position
      graphController.createNode(x, y);
      return true;
    }
    else
    {
      graphController.emit("tryCreateWhileTrash");
      return true;
    }

    return false;
  }

  //Override
  onDragStart(pointer)
  {
    return this.dragStartHandler.onEvent(pointer);
  }

  //Override
  onDragMove(pointer)
  {
    this.dragMoveHandler.onEvent(pointer);
  }

  //Override
  onDragStop(pointer)
  {
    this.dragStopHandler.onEvent(pointer);
  }

  //Override
  onPostActionEvent(pointer)
  {
    const inputController = this;
    const graphController = this._graphController;
    const picker = inputController.getPicker();

    picker.clearTarget();
  }

  //Override
  onZoomChange(pointer, zoomValue, prevValue)
  {
    return true;
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

  isMoveMode()
  {
    const result = this._inputAdapter.isAltAction();
    return this._swapMouseScheme ? !result : result;
  }

  isDragging()
  {
    return this._inputAdapter.isDragging();
  }

  isActionMode(graphController)
  {
    return this._inputAdapter.getPointer().isActive() ?
      //Is considered an action when NOT moving or when creating a new edge...
      graphController.isNewEdge || !this.isMoveMode() :
      //If not active, just show default action...
      !this._swapMouseScheme;
  }

  getPicker()
  {
    return this._picker;
  }

  getAdapter()
  {
    return this._inputAdapter;
  }
}

export default InputController;
