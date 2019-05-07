import AbstractEventHandler from 'session/manager/undo/AbstractEventHandler.js';

class SafeUndoNodeGraphEventHandler extends AbstractEventHandler
{
	constructor(graph, graphParser)
	{
		super();

		this._graph = graph;
		this._graphParser = graphParser;
		this._graphData = graphParser.compose(graph);
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
			this._graph.clear();
		}
	}

	/** @override */
	applyRedo(undoManager)
	{
		this._graphParser.parse(this._graphData, this._graph);
	}
}
export default SafeUndoNodeGraphEventHandler;
