import AbstractEventHandler from 'session/manager/undo/AbstractEventHandler.js';

class SafeUndoNodeGraphEventHandler extends AbstractEventHandler
{
    constructor(graphController, graphParser)
    {
        super();

        this._graphController = graphController;
        this._graphParser = graphParser;

        this._graphData = this._graphParser.compose(graphController.getGraph());
    }

    /** @override */
    applyUndo(undoManager)
    {
        const prevEvent = undoManager.getPreviousEvent();
        if (prevEvent instanceof SafeUndoNodeGraphEventHandler)
        {
            prevEvent.applyRedo(undoManager);
        }
        else
        {
            const graph = this._graphController.getGraph();
            graph.clear();
        }
    }

    /** @override */
    applyRedo(undoManager)
    {
        const graph = this._graphController.getGraph();
        this._graphParser.parse(this._graphData, graph);
    }
}
export default SafeUndoNodeGraphEventHandler;
