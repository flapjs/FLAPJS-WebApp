import Config from 'config.js';

import Node from 'graph/Node.js';
import Edge from 'graph/Edge.js';

import InputDownHandler from './handlers/InputDownHandler.js';
import DblActionHandler from './handlers/DblActionHandler.js';
import ActionHandler from './handlers/ActionHandler.js';
import DragStartHandler from './handlers/DragStartHandler.js';
import DragStopHandler from './handlers/DragStopHandler.js';
import DragMoveHandler from './handlers/DragMoveHandler.js';

class GraphAdapter
{
  constructor(controller)
  {
    this.controller = controller;
    this.inputController = null;

    this.firstEmptyClick = false;
    this.firstEmptyTime = 0;
    this.firstEmptyX = 0;
    this.firstEmptyY = 0;

    this.inputDownHandler = null;
    this.dblActionHandler = null;
    this.actionHandler = null;
    this.dragStartHandler = null;
    this.dragStopHandler = null;
    this.dragMoveHandler = null;

    this.onPreInputDown = this.onPreInputDown.bind(this);
    this.onInputDown = this.onInputDown.bind(this);
    this.onInputMove = this.onInputMove.bind(this);
    this.onInputUp = this.onInputUp.bind(this);
    this.onInputAction = this.onInputAction.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragStop = this.onDragStop.bind(this);
  }

  initialize(app)
  {
    this.inputController = app.inputController;

    this.inputDownHandler = new InputDownHandler(this.inputController, this.controller);
    this.dblActionHandler = new DblActionHandler(this.inputController, this.controller);
    this.actionHandler = new ActionHandler(this.inputController, this.controller);
    this.dragStartHandler = new DragStartHandler(this.inputController, this.controller);
    this.dragStopHandler = new DragStopHandler(this.inputController, this.controller);
    this.dragMoveHandler = new DragMoveHandler(this.inputController, this.controller);

    this.inputController.on("preinputdown", this.onPreInputDown);
    this.inputController.on("inputdown", this.onInputDown);
    this.inputController.on("inputmove", this.onInputMove);
    this.inputController.on("inputup", this.onInputUp);
    this.inputController.on("inputaction", this.onInputAction);
    this.inputController.on("dragstart", this.onDragStart);
    this.inputController.on("dragmove", this.onDragMove);
    this.inputController.on("dragstop", this.onDragStop);
  }

  destroy()
  {
    this.inputController.removeEventListener("inputdown", this.onInputDown);
    this.inputController.removeEventListener("inputmove", this.onInputMove);
    this.inputController.removeEventListener("inputup", this.onInputUp);
    this.inputController.removeEventListener("inputaction", this.onInputAction);
    this.inputController.removeEventListener("dragstart", this.onDragStart);
    this.inputController.removeEventListener("dragmove", this.onDragMove);
    this.inputController.removeEventListener("dragstop", this.onDragStop);
  }

  onPreInputDown()
  {
    const inputController = this.inputController;
    const pointer = inputController.getPointer();
    const picker = inputController.getPicker();

    picker.updateTarget(pointer.x, pointer.y);
    picker.setInitialTarget(picker.target, picker.targetType);

    return false;
  }

  onInputDown()
  {
    return this.inputDownHandler.onEvent();
  }

  onInputMove()
  {

  }

  onInputUp()
  {
    const inputController = this.inputController;
    const graphController = this.controller;
    const pointer = inputController.getPointer();
    const picker = inputController.getPicker();
    const x = pointer.x;
    const y = pointer.y;
    const target = picker.target;
    const targetType = picker.targetType;

    if (targetType === 'none')
    {
      const dx = x - this.firstEmptyX;
      const dy = y - this.firstEmptyY;
      //If within the time to double tap...
      if (this.firstEmptyClick && (dx * dx + dy * dy) < (Config.CURSOR_RADIUS_SQU * 16) && (Date.now() - this.firstEmptyTime < Config.DOUBLE_TAP_TICKS))
      {
        this.dblActionHandler.onEvent();

        this.firstEmptyClick = false;
      }
      else
      {
        //This is the first empty click, should wait for another...
        this.firstEmptyClick = true;
        this.firstEmptyTime = Date.now();
        this.firstEmptyX = x;
        this.firstEmptyY = y;
      }

      return true;
    }
  }

  onInputAction()
  {
    return this.actionHandler.onEvent();
  }

  onDragStart()
  {
    return this.dragStartHandler.onEvent();
  }

  onDragMove()
  {
    return this.dragMoveHandler.onEvent();
  }

  onDragStop()
  {
    return this.dragStopHandler.onEvent();
  }
}

export default GraphAdapter;
