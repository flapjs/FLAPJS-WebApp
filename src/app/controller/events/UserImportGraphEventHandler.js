import EventHandler from './EventHandler.js';

import NodalGraphParser from 'modules/fsa/graph/NodalGraphParser.js';

class UserImportGraphEventHandler extends EventHandler
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
      graphData: NodalGraphParser.toJSON(graph)
    };
  }

  //Override
  capturePostEvent(graph)
  {
    return {
      graphName: this.machineController.getMachineName(),
      graphData: NodalGraphParser.toJSON(graph)
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    NodalGraphParser.parseJSON(e.eventData.graphData, this.controller.getGraph());

    this.machineController.setMachineName(e.eventData.graphName);
  }

  //Override - this = event
  applyRedo(e)
  {
    NodalGraphParser.parseJSON(e.postData.graphData, this.controller.getGraph());

    this.machineController.setMachineName(e.postData.graphName);
  }
}
export default UserImportGraphEventHandler;
