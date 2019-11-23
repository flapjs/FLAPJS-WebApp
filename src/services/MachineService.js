import AbstractService from './AbstractService.js';

class MachineService extends AbstractService
{
    static get SERVICE_KEY() { return 'machineService'; }
    
    constructor()
    {
        super();

        this.machineControllerClass = null;
        this.machineController = null;

        this._graphService = null;

        this._onGraphControllerChange = null;
        this._onInputControllerChange = null;
        this._onViewControllerChange = null;
        this._onMachineControllerChange = null;
    }

    setMachineControllerClass(machineControllerClass)
    {
        this.machineControllerClass = machineControllerClass;
        return this;
    }

    enableGraphServiceFeatures(graphService)
    {
        this._graphService = graphService;
        return this;
    }

    /** @override */
    load(session)
    {
        super.load(session);
        
        if (this.machineControllerClass)
        {
            this.machineController = new (this.machineControllerClass)();
            this.machineController.setGraphController(this._graphService.graphController);
            this.machineController.setSession(session);
        }

        if (this.machineController) this.machineController.initialize();
        session.machineController = this.machineController;

        return this;
    }

    /** @override */
    mount(sessionProvider)
    {
        super.mount(sessionProvider);

        // HACK: This forces everything to re-render every time something either in the
        // graph, input, or view changes.
        // This is pretty bad practice. If something depends on one of those 3 things,
        // they should register themselves with that controller's change handler.
        this._onMachineControllerChange = this.onMachineControllerChange.bind(this, sessionProvider);
        if (this.machineController) sessionProvider.state.machineController.getChangeHandler().addChangeListener(this._onMachineControllerChange);

        return this;
    }

    /** @override */
    unmount(sessionProvider)
    {
        super.unmount(sessionProvider);

        if (this.machineController) sessionProvider.state.machineController.getChangeHandler().removeChangeListener(this._onMachineControllerChange);
        this._onMachineControllerChange = null;

        return this;
    }

    /** @override */
    unload(session)
    {
        super.unload(session);

        if (this.machineController) this.machineController.terminate();
        delete session.machineController;

        return this;
    }

    onMachineControllerChange(sessionProvider, machineController, hash)
    {
        sessionProvider.setState({ machineHash: hash });
    }
}

export default MachineService;
