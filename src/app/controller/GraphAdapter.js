import InputDownHandler from './handlers/InputDownHandler.js';
import DblActionHandler from './handlers/DblActionHandler.js';
import ActionHandler from './handlers/ActionHandler.js';
import DragStartHandler from './handlers/DragStartHandler.js';
import DragStopHandler from './handlers/DragStopHandler.js';
import DragMoveHandler from './handlers/DragMoveHandler.js';

class GraphAdapter
{
  constructor(inputController, graphController)
  {
    this.inputController = inputController;
    this.graphController = graphController;

    this.inputDownHandler = new InputDownHandler(inputController, graphController);
    this.dblActionHandler = new DblActionHandler(inputController, graphController);
    this.actionHandler = new ActionHandler(inputController, graphController);
    this.dragStartHandler = new DragStartHandler(inputController, graphController);
    this.dragStopHandler = new DragStopHandler(inputController, graphController);
    this.dragMoveHandler = new DragMoveHandler(inputController, graphController);
  }

  onPreActionEvent(pointer)
  {
    const inputController = this.inputController;
    const picker = inputController.getPicker();

    picker.updateTarget(pointer.x, pointer.y);
    picker.setInitialTarget(picker.target, picker.targetType);

    return this.inputDownHandler.onEvent(pointer);
  }

  onActionEvent(pointer)
  {
    return this.actionHandler.onEvent(pointer);
  }

  onAltActionEvent(pointer)
  {
    return this.onActionEvent(pointer);
  }

  onDblActionEvent(pointer)
  {
    return this.dblActionHandler.onEvent(pointer);
  }

  onDragStart(pointer)
  {
    return this.dragStartHandler.onEvent(pointer);
  }

  onDragMove(pointer)
  {
    this.dragMoveHandler.onEvent(pointer);
  }

  onDragStop(pointer)
  {
    this.dragStopHandler.onEvent(pointer);
  }

  onPostActionEvent(pointer)
  {
    const inputController = this.inputController;
    const graphController = this.graphController;
    const picker = inputController.getPicker();

    picker.clearTarget();
  }

  onZoomChange(pointer, zoomValue, prevValue)
  {
    return true;
  }
}

export default GraphAdapter;
