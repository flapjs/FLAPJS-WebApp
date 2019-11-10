class AbstractMachineController
{
    constructor(currentModule, machineBuilder)
    {
        if (!currentModule) throw new Error('Missing module for machine controller');
        if (!machineBuilder) throw new Error('Missing machine builder for machine controller');

        this._module = currentModule;
        this._machineBuilder = machineBuilder;
    }

    initialize(currentModule)
    {
        this._machineBuilder.initialize(currentModule);
    }

    destroy(currentModule)
    {
        this._machineBuilder.destroy(currentModule);
    }

    update(currentModule)
    {
    }

    getMachineBuilder()
    {
        return this._machineBuilder;
    }

    getModule()
    {
        return this._module;
    }
}

export default AbstractMachineController;
