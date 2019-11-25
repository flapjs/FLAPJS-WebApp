class AbstractMachineValidator
{
    constructor()
    {
        this.machineController = null;
        this.graphController = null;
        this.session = null;
    }

    setMachineController(machineController)
    {
        this.machineController = machineController;
        return this;
    }

    setGraphController(graphController)
    {
        this.graphController = graphController;
        return this;
    }

    setSession(session)
    {
        this.session = session;
        return this;
    }

    validate(machineController) {}
}

export default AbstractMachineValidator;
