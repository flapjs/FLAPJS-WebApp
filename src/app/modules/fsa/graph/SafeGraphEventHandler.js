import AbstractEventHandler from 'system/undomanager/AbstractEventHandler.js';
import { JSON as JSONParser } from './FSAGraphParser.js';

class SafeGraphEventHandler extends AbstractEventHandler
{
  constructor(graphController)
  {
    super();

    this._graphController = graphController;
    this._graphData = JSONParser.objectify(graphController.getGraph());
  }

  //Override
  applyUndo(undoManager)
  {
    const prevEvent = undoManager.getPreviousEvent();
    if (prevEvent instanceof SafeGraphEventHandler)
    {
      prevEvent.applyRedo(undoManager);
    }
    else
    {
      this._graphController.getGraph().clear();
    }
  }

  //Override
  applyRedo(undoManager)
  {
    JSONParser.parse(this._graphData, this._graphController.getGraph());
  }
}
export default SafeGraphEventHandler;
