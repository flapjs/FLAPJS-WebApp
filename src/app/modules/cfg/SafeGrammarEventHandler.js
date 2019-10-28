import AbstractEventHandler from 'session/manager/undo/AbstractEventHandler.js';

class SafeGrammarEventHandler extends AbstractEventHandler
{
    constructor(machineController)
    {
        super();

        this._machineController = machineController;
        this._machine = machineController.getMachine();
    }

    /** @override */
    applyUndo(undoManager)
    {
        const prevEvent = undoManager.getPreviousEvent();
        if (prevEvent instanceof SafeGrammarEventHandler)
        {
            prevEvent.applyRedo(undoManager);
        }
        else
        {
            this._machineController.clear();
        }
    }

    /** @override */
    applyRedo(undoManager)
    {
        this._machineController.setMachine(this._machine);
    }
}
export default SafeGrammarEventHandler;
