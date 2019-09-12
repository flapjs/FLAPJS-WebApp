import MachineChangeHandler from 'experimental/MachineChangeHandler.js';

class AbstractMachineBuilder
{
    constructor()
    {
        this._machineChangeHandler = new MachineChangeHandler();

        this._errors = [];
        this._warnings = [];

        this.onGraphChange = this.onGraphChange.bind(this);
    }

    initialize(module)
    {
        module.getGraphController().getGraphChangeHandler().addListener(this.onGraphChange);
    }

    destroy(module)
    {
        module.getGraphController().getGraphChangeHandler().removeListener(this.onGraphChange);
    }

    onGraphChange(graph)
    {
        this.attemptBuildMachine(graph, this.getMachine(), this._errors, this._warnings);
        this._machineChangeHandler.update(this);
    }

    attemptBuildGraph(machine, dst)
    {
        throw new Error('Missing graph build operation');
    }

    attemptBuildMachine(graph, dst, errors, warnings)
    {
        throw new Error('Missing machine build operation');
    }

    getMachineErrors()
    {
        return this._errors;
    }

    getMachineWarnings()
    {
        return this._warnings;
    }

    getMachineChangeHandler()
    {
        return this._machineChangeHandler;
    }

    isMachineValid()
    {
        return this._errors.length <= 0;
    }

    getMachine()
    {
        throw new Error('Missing machine for builder');
    }
}

export default AbstractMachineBuilder;
