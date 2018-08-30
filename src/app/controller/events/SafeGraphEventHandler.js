import GraphEventHandler from './GraphEventHandler.js';

import NodalGraph from 'graph/NodalGraph.js';

class SafeGraphEventHandler extends GraphEventHandler
{
  constructor(eventLogger, graphController, eventName, postEventName)
  {
    super(eventLogger, graphController, eventName, postEventName);
  }

  //Override
  captureEvent(graph)
  {
    return {
      graphData: graph.toJSON()
    };
  }

  //Override
  capturePostEvent(graph)
  {
    return {
      graphData: graph.toJSON()
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    NodalGraph.parseJSON(e.eventData.graphData, this.graphController.getGraph());
  }

  //Override - this = event
  applyRedo(e)
  {
    NodalGraph.parseJSON(e.postData.graphData, this.graphController.getGraph());
  }
}
export default SafeGraphEventHandler;
