import EventHandler from './EventHandler.js';

import * as FSAGraphParser from 'deprecated/fsa/graph/FSAGraphParser.js';

class UserConvertMachineEventHandler extends EventHandler
{
    constructor(eventLogger, machineController, graphController)
    {
        super(eventLogger, machineController, 'userPreConvertMachine', 'userPostConvertMachine');

        this.graphController = graphController;
    }

    /** @override */
    captureEvent(machineBuilder, nextMachineType, prevMachineType)
    {
        const graph = this.graphController.getGraph();

        return {
            graphData: FSAGraphParser.JSON.objectify(graph),
            prevType: prevMachineType
        };
    }

    /** @override */
    capturePostEvent(machineBuilder, nextMachineType, prevMachineType)
    {
        const graph = this.graphController.getGraph();

        return {
            graphData: FSAGraphParser.JSON.objectify(graph),
            nextType: nextMachineType
        };
    }

    //Override - this = event
    applyUndo(e)
    {
        FSAGraphParser.JSON.parse(e.eventData.graphData, this.graphController.getGraph());
        this.controller.setMachineType(e.eventData.prevType);
    }

    //Override - this = event
    applyRedo(e)
    {
        FSAGraphParser.JSON.parse(e.postData.graphData, this.graphController.getGraph());
        this.controller.setMachineType(e.postData.nextType);
    }
}
export default UserConvertMachineEventHandler;
