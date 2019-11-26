import AbstractController from '@flapjs/services/graph/controller/AbstractController.js';

class MachineController extends AbstractController
{
    constructor(machineBuilder)
    {
        super();
        
        this._machineBuilder = machineBuilder;
        this._graphController = null;

        this.onGraphControllerChange = this.onGraphControllerChange.bind(this);
    }

    setGraphController(graphController)
    {
        this._graphController = graphController;
        return this;
    }

    /** @override */
    initialize()
    {
        super.initialize();

        if (this._graphController)
        {
            this._graphController.getChangeHandler().addChangeListener(this.onGraphControllerChange);
        }
    }

    /** @override */
    terminate()
    {
        super.terminate();

        if (this._graphController)
        {
            this._graphController.getChangeHandler().removeChangeListener(this.onGraphControllerChange);
        }
    }
    
    /** @override */
    getControlledHashCode(self)
    {
        return self.getMachineBuilder().getMachineHashCode();
    }

    onGraphControllerChange(graphController)
    {
        this._machineBuilder.attemptBuildMachine(graphController.getGraph(), this._machineBuilder.getMachine());
        this._changeHandler.update(this);
    }

    // TODO: This really shouldn't have access to graph controller. Separation of concerns please.
    getGraphController() { return this._graphController; }
    
    getMachineBuilder() { return this._machineBuilder; }
    getMachine() { return this._machineBuilder.getMachine(); }
}

export default MachineController;
