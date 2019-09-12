import EventHandler from './EventHandler.js';

import * as FSAGraphParser from 'deprecated/fsa/graph/FSAGraphParser.js';

class UserRenameSymbolEventHandler extends EventHandler
{
    constructor(eventLogger, machineController, graphController)
    {
        super(eventLogger, machineController, 'userPreRenameSymbol', 'userPostRenameSymbol');

        this.graphController = graphController;
    }

    /** @override */
    captureEvent(machineBuilder, symbol, prevSymbol)
    {
        const graph = this.graphController.getGraph();
        return {
            graphData: FSAGraphParser.JSON.objectify(graph),
            symbol: symbol,
            prevSymbol: prevSymbol
        };
    }

    /** @override */
    capturePostEvent(machineBuilder, symbol, prevSymbol, targets)
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
            prevSymbol: prevSymbol,
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
export default UserRenameSymbolEventHandler;
