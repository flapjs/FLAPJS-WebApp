import AbstractInputController from 'modules/abstract/AbstractInputController.js';

//import NodalGraphPicker from 'graph/picker/NodalGraphPicker.js';
import GraphNodeSelectionBox from 'graph/GraphNodeSelectionBox.js';
import GraphPicker from './GraphPicker.js';

import GraphNodeInputHandler from './inputhandler/GraphNodeInputHandler.js';
import GraphInitialInputHandler from './inputhandler/GraphInitialInputHandler.js';

import GraphEdgeInputHandler from 'modules/default/controller/inputhandler/GraphEdgeInputHandler.js';
import GraphEndpointInputHandler from 'modules/default/controller/inputhandler/GraphEndpointInputHandler.js';
import GraphNodeCreateInputHandler from 'modules/default/controller/inputhandler/GraphNodeCreateInputHandler.js';
import SelectionBoxInputHandler from 'modules/default/controller/inputhandler/SelectionBoxInputHandler.js';

const DEFAULT_SHOULD_DESTROY_POINTLESS_EDGE = true;

class InputController extends AbstractInputController
{
  constructor(module, inputAdapter)
  {
    super(module, inputAdapter);

    this._picker = null;
    this._selectionBox = new GraphNodeSelectionBox();
    this._graphController = null;

    //Make sure this is always false when moving endpoints
    this.isNewEdge = false;

    //Used to change render to follow pointer when moving initial marker
    this.ghostInitialMarker = null;

    //Whether to destroy pointless edges
    this.shouldDestroyPointlessEdges = DEFAULT_SHOULD_DESTROY_POINTLESS_EDGE;

    //Swap left to right clicks and vice versa on anything else but Macs
    this._swapMouseScheme = true;//!navigator.platform.startsWith("Mac");

    //Used to determine whether the target should be destroyed because of trash mode
    this._trashMode = false;

    this._disabled = false;

    //TODO: this works, it's just not attached to anything
    this._snapToGrid = false;
    this._snapSize = 48;

    this._inputHandlers = [
      new GraphNodeInputHandler(),
      new GraphEdgeInputHandler(),
      new GraphEndpointInputHandler(),
      new GraphInitialInputHandler(),
      new SelectionBoxInputHandler(this._selectionBox),
      new GraphNodeCreateInputHandler()
    ];
  }

  //Override
  initialize(module)
  {
    super.initialize(module);

    this._graphController = module.getGraphController();
    //this._picker = new NodalGraphPicker(this._graphController);
    this._picker = new GraphPicker(this._graphController);
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

    const graph = this._graphController.getGraph();
    const picker = this._picker;

    const x = this._inputAdapter.getPointerX();
    const y = this._inputAdapter.getPointerY();
    picker.updateHoverTarget(graph, x, y);
  }

  setDisabled(disabled)
  {
    this._disabled = disabled;
  }

  isDisabled()
  {
    return this._disabled;
  }

  //Override
  onPreInputEvent(pointer)
  {
    if (this._disabled) return super.onPreInputEvent(pointer);

    const inputController = this;
    const graphController = this._graphController;

    const graph = graphController.getGraph();
    const picker = inputController.getPicker();
    picker.updateInitialTarget(graph, pointer.x, pointer.y);

    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    if (this._selectionBox.hasSelection())
    {
      //Unselect everything is clicked on something other than nodes...
      if (targetType != "node" || !this._selectionBox.isTargetInSelection(target))
      {
        this._selectionBox.clearSelection();
      }
    }

    //Override
    return super.onPreInputEvent(pointer);
  }

  //Override
  onInputEvent(pointer)
  {
    if (this._disabled) return super.onInputEvent(pointer);

    const inputController = this;
    const graphController = this._graphController;
    const picker = inputController.getPicker();
    picker.updateTarget(graphController.getGraph(), pointer.x, pointer.y);
    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    for(const handler of this._inputHandlers)
    {
      if (handler.isTargetable(inputController, pointer, target, targetType) &&
        handler.onAction(inputController, graphController, pointer, target))
      {
        return true;
      }
    }

    //Override
    return super.onInputEvent(pointer);
  }

  //Override
  onDblInputEvent(pointer)
  {
    if (this._disabled) return super.onDblInputEvent(pointer);

    const inputController = this;
    const graphController = this._graphController;
    const picker = inputController.getPicker();
    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    //Make sure it is not in trash mode
    if (inputController.isTrashMode())
    {
      graphController.emit("tryCreateWhileTrash");
      return false;
    }

    for(const handler of this._inputHandlers)
    {
      if (handler.isTargetable(inputController, pointer, target, targetType) &&
        handler.onDblAction(inputController, graphController, pointer, target))
      {
        return true;
      }
    }

    //Override
    return super.onDblInputEvent(pointer);
  }

  //Override
  onDragStart(pointer)
  {
    if (this._disabled) return super.onDragStart(pointer);

    const inputController = this;
    const graphController = this._graphController;
    const picker = inputController.getPicker();
    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    //Make sure it is not in new edge mode
    inputController.isNewEdge = false;

    //Make sure it is not in trash mode
    if (inputController.isTrashMode())
    {
      graphController.emit("tryCreateWhileTrash");
      return false;
    }

    for(const handler of this._inputHandlers)
    {
      if (handler.isTargetable(inputController, pointer, target, targetType) &&
        handler.onDragStart(inputController, graphController, pointer, target))
      {
        return true;
      }
    }

    //Override
    return super.onDragStart(pointer);
  }

  //Override
  onDragMove(pointer)
  {
    if (this._disabled) return super.onDragMove(pointer);

    const inputController = this;
    const graphController = this._graphController;
    const picker = inputController.getPicker();
    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    for(const handler of this._inputHandlers)
    {
      if (handler.isTargetable(inputController, pointer, target, targetType) &&
        handler.onDragMove(inputController, graphController, pointer, target))
      {
        return true;
      }
    }

    //Override
    return super.onDragMove(pointer);
  }

  //Override
  onDragStop(pointer)
  {
    if (this._disabled) return super.onDragStop(pointer);

    const inputController = this;
    const graphController = this._graphController;
    const picker = inputController.getPicker();
    picker.updateTarget(graphController.getGraph(), pointer.x, pointer.y);
    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    for(const handler of this._inputHandlers)
    {
      if (handler.isTargetable(inputController, pointer, target, targetType) &&
        handler.onDragStop(inputController, graphController, pointer, target))
      {
        return true;
      }
    }

    //Override
    return super.onDragStop(pointer);
  }

  //Override
  onPostInputEvent(pointer)
  {
    if (this._disabled) return super.onPostInputEvent(pointer);

    const inputController = this;
    const graphController = this._graphController;
    const graph = graphController.getGraph();
    const picker = inputController.getPicker();

    picker.clearTarget();
    picker.updateTarget(graph, pointer.x, pointer.y);

    //Override
    super.onPostInputEvent(pointer);
  }

  setTrashMode(enabled)
  {
    this._trashMode = enabled;
    if (enabled)
    {
      this._module.getApp()._drawer.setViewportColor("var(--color-viewport-error)");
    }
    else
    {
      this._module.getApp()._drawer.setViewportColor(null);
    }
  }

  isTrashMode()
  {
    return this._trashMode;
  }

  setInputScheme(shouldInputFirst)
  {
    this._swapMouseScheme = !shouldInputFirst;
  }

  getInputScheme()
  {
    return this._swapMouseScheme;
  }

  isMoveMode()
  {
    const result = this._inputAdapter.isAltInput();
    return this._swapMouseScheme ? !result : result;
  }

  isDragging()
  {
    return this._inputAdapter.isDragging();
  }

  isActionMode()
  {
    return this._inputAdapter.isPointerActive() ?
      //Is considered an input when NOT moving or when creating a new edge...
      this.isNewEdge || !this.isMoveMode() :
      //If not active, just show default input...
      !this._swapMouseScheme;
  }

  getPicker()
  {
    return this._picker;
  }

  getSelectionBox()
  {
    return this._selectionBox;
  }
}

export default InputController;
