class AbstractMachineController
{
    constructor(module, machineBuilder)
    {
        if (!module) throw new Error('Missing module for machine controller');
        if (!machineBuilder) throw new Error('Missing machine builder for machine controller');

        this._module = module;
        this._machineBuilder = machineBuilder;
    }

    initialize(module)
    {
        this._machineBuilder.initialize(module);
    }

    destroy(module)
    {
        this._machineBuilder.destroy(module);
    }

    update(module)
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
