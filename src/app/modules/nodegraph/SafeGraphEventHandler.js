import AbstractEventHandler from 'session/manager/undo/AbstractEventHandler.js';

class SafeGraphEventHandler extends AbstractEventHandler
{
    constructor(graphController, graphParser)
    {
        super();

        this._graphController = graphController;
        this._graphParser = graphParser;
        this._graphData = graphParser.objectify(graphController.getGraph());
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
        this._graphParser.parse(this._graphData, this._graphController.getGraph());
    }
}
export default SafeGraphEventHandler;
