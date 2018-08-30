import EventHandler from './EventHandler.js';

class UserChangeMachineEventHandler extends EventHandler
{
  constructor(eventLogger, machineController)
  {
    super(eventLogger, machineController, "userChangeMachine");
  }

  //Override
  captureEvent(machineBuilder, nextMachineType, prevMachineType)
  {
    return {
      prevType: prevMachineType,
      nextType: nextMachineType
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    const machineBuilder = this.controller.getMachineBuilder();
    machineBuilder.setMachineType(e.eventData.prevType);
  }

  //Override - this = event
  applyRedo(e)
  {
    const machineBuilder = this.controller.getMachineBuilder();
    machineBuilder.setMachineType(e.eventData.nextType);
  }
}
export default UserChangeMachineEventHandler;
