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

    /** @override */ - this = event
    applyUndo(e)
    {
        this.controller.setMachineType(e.eventData.prevType);
    }

    /** @override */ - this = event
    applyRedo(e)
    {
        this.controller.setMachineType(e.postData.nextType);
    }
}
export default UserChangeMachineEventHandler;
