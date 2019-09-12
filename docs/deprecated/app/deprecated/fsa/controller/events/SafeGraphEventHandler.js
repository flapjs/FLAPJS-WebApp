import EventHandler from './EventHandler.js';

import * as FSAGraphParser from 'deprecated/fsa/graph/FSAGraphParser.js';

class SafeGraphEventHandler extends EventHandler
{
    constructor(eventLogger, graphController, eventName, postEventName)
    {
        super(eventLogger, graphController, eventName, postEventName);
    }

    /** @override */
    captureEvent(graph)
    {
        return {
            graphData: FSAGraphParser.JSON.objectify(graph)
        };
    }

    /** @override */
    capturePostEvent(graph)
    {
        return {
            graphData: FSAGraphParser.JSON.objectify(graph)
        };
    }

    //Override - this = event
    applyUndo(e)
    {
        FSAGraphParser.JSON.parse(e.eventData.graphData, this.controller.getGraph());
    }

    //Override - this = event
    applyRedo(e)
    {
        FSAGraphParser.JSON.parse(e.postData.graphData, this.controller.getGraph());
    }
}
export default SafeGraphEventHandler;
