import EventHandler from './EventHandler.js';

import * as FSAGraphParser from 'deprecated/fsa/graph/FSAGraphParser.js';

class UserDeleteSymbolEventHandler extends EventHandler
{
    constructor(eventLogger, machineController, graphController)
    {
        super(eventLogger, machineController, 'userPreDeleteSymbol', 'userPostDeleteSymbol');

        this.graphController = graphController;
    }

    /** @override */
    captureEvent(machineBuilder, symbol)
    {
        const graph = this.graphController.getGraph();
        return {
            graphData: FSAGraphParser.JSON.objectify(graph),
            symbol: symbol
        };
    }

    /** @override */
    capturePostEvent(machineBuilder, symbol, targets)
    {
        const graph = this.graphController.getGraph();
        const targetIDs = [];

        for(const target of targets)
        {
            targetIDs.push(target.getGraphElementID());
        }

        return {
            graphData: FSAGraphParser.JSON.objectify(graph),
            symbol: symbol,
            targets: targetIDs
        };
    }

    //Override - this = event
    applyUndo(e)
    {
    //TODO: restore machine custom alphabet
        FSAGraphParser.JSON.parse(e.eventData.graphData, this.graphController.getGraph());
    }

    //Override - this = event
    applyRedo(e)
    {
    //TODO: restore machine custom alphabet
        FSAGraphParser.JSON.parse(e.postData.graphData, this.graphController.getGraph());
    }
}
export default UserDeleteSymbolEventHandler;
