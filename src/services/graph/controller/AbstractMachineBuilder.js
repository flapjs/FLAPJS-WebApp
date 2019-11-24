class AbstractMachineBuilder
{
    constructor() {}

    attemptBuildMachine(graph, dst)
    {
        throw new Error('Should be overriden.');
    }

    getMachine()
    {
        throw new Error('Should be overriden.');
    }

    getMachineHashCode()
    {
        throw new Error('Should be overriden.');
    }
}

export default AbstractMachineBuilder;
