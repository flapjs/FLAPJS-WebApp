import AbstractService from './AbstractService.js';
import { createServiceContext } from '@flapjs/services/util/ServiceContextFactory.js';

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
    onServiceLoad(state)
    {
        state.machineController = this.machineController;
    }

    /** @override */
    onServiceMount(provider)
    {
        // HACK: This forces everything to re-render every time something either in the
        // graph, input, or view changes.
        // This is pretty bad practice. If something depends on one of those 3 things,
        // they should register themselves with that controller's change handler.
        this._onMachineControllerChange = this.onMachineControllerChange.bind(this, provider);
        if (this.machineController) provider.state.machineController.getChangeHandler().addChangeListener(this._onMachineControllerChange);
    }

    /** @override */
    onServiceUnmount(provider)
    {
        if (this.machineController) provider.state.machineController.getChangeHandler().removeChangeListener(this._onMachineControllerChange);
        this._onMachineControllerChange = null;
    }

    /** @override */
    onServiceUnload(state)
    {
        delete state.machineController;
    }

    /** @override */
    onSessionLoad(session)
    {
        if (this.machineControllerClass)
        {
            this.machineController = new (this.machineControllerClass)();
            this.machineController.setGraphController(this._graphService.graphController);
            this.machineController.setSession(session);
        }

        if (this.machineController) this.machineController.initialize();
        session.machineController = this.machineController;
    }

    /** @override */
    onSessionUnload(session)
    {
        if (this.machineController) this.machineController.terminate();
        delete session.machineController;
    }

    onMachineControllerChange(provider, machineController, hash)
    {
        provider.setState({ machineHash: hash });
    }
}
MachineService.INSTANCE = new MachineService();
MachineService.CONTEXT = createServiceContext('MachineService', MachineService.INSTANCE);

export default MachineService;
