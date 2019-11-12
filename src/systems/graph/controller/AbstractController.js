import ControllerChangeHandler from '@flapjs/systems/graph/controller/ControllerChangeHandler';
import EventManager from '@flapjs/util/event/EventManager.js';

class AbstractController extends EventManager
{
    constructor()
    {
        super();

        this.getControlledHashCode = this.getControlledHashCode.bind(this);
        this._changeHandler = new ControllerChangeHandler(this, this.getControlledHashCode);
    }

    initialize()
    {
        this._changeHandler.startListeningForChanges();
    }

    terminate()
    {
        this._changeHandler.stopListeningForChanges();
        this.clearEventListeners();
    }

    getChangeHandler()
    {
        return this._changeHandler;
    }

    getControlledHashCode(self)
    {
        return JSON.stringify(self);
    }
}

export default AbstractController;
