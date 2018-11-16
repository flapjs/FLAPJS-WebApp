import AcceptNodeHandler from './AcceptNodeHandler.js';
import TrashModeHandler from './TrashModeHandler.js';
import EditLabelHandler from './EditLabelHandler.js';

class DblActionEvent
{
  constructor(inputController, graphController)
  {
    this.inputController = inputController;
    this.graphController = graphController;

    this.acceptNodeHandler = new AcceptNodeHandler(graphController);
    this.trashModeHandler = new TrashModeHandler(graphController);
    this.editLabelHandler = new EditLabelHandler(graphController);
  }

  onEvent()
  {
    const inputController = this.inputController;
    const graphController = this.graphController;
    const pointer = inputController.getPointer();
    const picker = inputController.getPicker();
    picker.updateTarget(pointer.x, pointer.y);
    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    //If is in trash mode... capture all events!
    if (this.trashModeHandler.onActionEvent(pointer, picker)) return true;

    //If not in Trash Mode, then events should pass through to here...
    //Otherwise, ALL events are captured to prevent ALL default behavior.

    //Makes sure that user cannot toggle state while in trash mode
    if (this.acceptNodeHandler.onActionEvent(pointer, picker)) return true;
    //Edit label for selected edge
    if (this.editLabelHandler.onActionEvent(pointer, picker)) return true;

    return false;
  }
}

export default DblActionEvent;
