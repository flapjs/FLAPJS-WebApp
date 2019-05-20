import EventHandler from './EventHandler.js';

class UserChangeMachineEventHandler extends EventHandler
{
    constructor(eventLogger, machineController)
    {
        super(eventLogger, machineController, 'userChangeMachine');
    }

    /** @override */
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
        this.controller.setMachineType(e.eventData.prevType);
    }

    //Override - this = event
    applyRedo(e)
    {
        this.controller.setMachineType(e.postData.nextType);
    }
}
export default UserChangeMachineEventHandler;
