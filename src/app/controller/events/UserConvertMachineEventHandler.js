import EventHandler from './EventHandler.js';

import NodalGraphParser from 'modules/fsa/graph/NodalGraphParser.js';

class UserConvertMachineEventHandler extends EventHandler
{
  constructor(eventLogger, machineController, graphController)
  {
    super(eventLogger, machineController, "userPreConvertMachine", "userPostConvertMachine");

    this.graphController = graphController;
  }

  //Override
  captureEvent(machineBuilder, nextMachineType, prevMachineType)
  {
    const graph = this.graphController.getGraph();

    return {
      graphData: NodalGraphParser.toJSON(graph),
      prevType: prevMachineType
    };
  }

  //Override
  capturePostEvent(machineBuilder, nextMachineType, prevMachineType)
  {
    const graph = this.graphController.getGraph();

    return {
      graphData: NodalGraphParser.toJSON(graph),
      nextType: nextMachineType
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    NodalGraphParser.parseJSON(e.eventData.graphData, this.graphController.getGraph());
    this.controller.setMachineType(e.eventData.prevType);
  }

  //Override - this = event
  applyRedo(e)
  {
    NodalGraphParser.parseJSON(e.postData.graphData, this.graphController.getGraph());
    this.controller.setMachineType(e.postData.nextType);
  }
}
export default UserConvertMachineEventHandler;
