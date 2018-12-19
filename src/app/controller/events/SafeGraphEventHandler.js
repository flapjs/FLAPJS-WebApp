import EventHandler from './EventHandler.js';

import NodalGraph from 'modules/fsa/graph/NodalGraph.js';
import NodalGraphParser from 'modules/fsa/graph/NodalGraphParser.js';

class SafeGraphEventHandler extends EventHandler
{
  constructor(eventLogger, graphController, eventName, postEventName)
  {
    super(eventLogger, graphController, eventName, postEventName);
  }

  //Override
  captureEvent(graph)
  {
    return {
      graphData: NodalGraphParser.toJSON(graph)
    };
  }

  //Override
  capturePostEvent(graph)
  {
    return {
      graphData: NodalGraphParser.toJSON(graph)
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    NodalGraphParser.parseJSON(e.eventData.graphData, this.controller.getGraph());
  }

  //Override - this = event
  applyRedo(e)
  {
    NodalGraphParser.parseJSON(e.postData.graphData, this.controller.getGraph());
  }
}
export default SafeGraphEventHandler;
