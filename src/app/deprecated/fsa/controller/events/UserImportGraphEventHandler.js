import EventHandler from './EventHandler.js';

import * as FSAGraphParser from 'deprecated/fsa/graph/FSAGraphParser.js';

class UserImportGraphEventHandler extends EventHandler
{
    constructor(eventLogger, graphController, machineController)
    {
        super(eventLogger, graphController, 'userPreImportGraph', 'userPostImportGraph');

        this.machineController = machineController;
    }

    /** @override */
    captureEvent(graph)
    {
        return {
            graphName: this.machineController.getMachineName(),
            graphData: FSAGraphParser.JSON.objectify(graph)
        };
    }

    /** @override */
    capturePostEvent(graph)
    {
        return {
            graphName: this.machineController.getMachineName(),
            graphData: FSAGraphParser.JSON.objectify(graph)
        };
    }

    //Override - this = event
    applyUndo(e)
    {
        FSAGraphParser.JSON.parse(e.eventData.graphData, this.controller.getGraph());

        this.machineController.setMachineName(e.eventData.graphName);
    }

    //Override - this = event
    applyRedo(e)
    {
        FSAGraphParser.JSON.parse(e.postData.graphData, this.controller.getGraph());

        this.machineController.setMachineName(e.postData.graphName);
    }
}
export default UserImportGraphEventHandler;
