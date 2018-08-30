import EventHandler from './EventHandler.js';

import NodalGraph from 'graph/NodalGraph.js';

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
      graphData: graph.toJSON(),
      prevType: prevMachineType
    };
  }

  //Override
  capturePostEvent(machineBuilder, nextMachineType, prevMachineType)
  {
    const graph = this.graphController.getGraph();

    return {
      graphData: graph.toJSON(),
      nextType: nextMachineType
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    NodalGraph.parseJSON(e.eventData.graphData, this.graphController.getGraph());
    this.controller.setMachineType(e.eventData.prevType);
  }

  //Override - this = event
  applyRedo(e)
  {
    NodalGraph.parseJSON(e.postData.graphData, this.graphController.getGraph());
    this.controller.setMachineType(e.postData.nextType);
  }
}
export default UserConvertMachineEventHandler;
