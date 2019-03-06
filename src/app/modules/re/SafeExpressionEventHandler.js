import AbstractEventHandler from 'manager/undo/AbstractEventHandler.js';

class SafeExpressionEventHandler extends AbstractEventHandler
{
  constructor(machineController)
  {
    super();

    this._machineController = machineController;
    this._expression = machineController.getMachineExpression();
  }

  //Override
  applyUndo(undoManager)
  {
    const prevEvent = undoManager.getPreviousEvent();
    if (prevEvent instanceof SafeExpressionEventHandler)
    {
      prevEvent.applyRedo(undoManager);
    }
    else
    {
      this._machineController.clear();
    }
  }

  //Override
  applyRedo(undoManager)
  {
    this._machineController.setMachineExpression(this._expression);
  }
}
export default SafeExpressionEventHandler;
