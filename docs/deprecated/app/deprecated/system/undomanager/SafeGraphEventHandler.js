import AbstractEventHandler from './AbstractEventHandler.js';

class SafeGraphEventHandler extends AbstractEventHandler
{
  constructor(graphController)
  {
    super();

    this._graphController = graphController;

    const parser = graphController.getGraphParser();
    this._graphData = parser.objectify(graphController.getGraph());
  }

  /** @override */
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

  /** @override */
  applyRedo(undoManager)
  {
    const graphController = this._graphController;
    const parser = graphController.getGraphParser();
    parser.parse(this._graphData, graphController.getGraph());
  }
}
export default SafeGraphEventHandler;
