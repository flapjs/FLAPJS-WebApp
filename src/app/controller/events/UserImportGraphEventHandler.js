import GraphEventHandler from './GraphEventHandler.js';

import NodalGraph from 'graph/NodalGraph.js';

class UserCreateNodeEventHandler extends GraphEventHandler
{
  constructor(eventLogger, graphController, machineController)
  {
    super(eventLogger, graphController, "userPreImportGraph", "userPostImportGraph");

    this.machineController = machineController;
  }

  //Override
  captureEvent(graph)
  {
    return {
      graphName: this.machineController.getMachineName(),
      graphData: graph.toJSON()
    };
  }

  //Override
  capturePostEvent(graph)
  {
    return {
      graphName: this.machineController.getMachineName(),
      graphData: graph.toJSON()
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    NodalGraph.parseJSON(e.eventData.graphData, this.graphController.getGraph());

    this.machineController.setMachineName(e.eventData.graphName);
  }

  //Override - this = event
  applyRedo(e)
  {
    NodalGraph.parseJSON(e.postData.graphData, this.graphController.getGraph());

    this.machineController.setMachineName(e.postData.graphName);
  }
}
export default UserCreateNodeEventHandler;
