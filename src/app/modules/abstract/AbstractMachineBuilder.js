class AbstractMachineBuilder
{
  constructor()
  {
		this._graph = null;
		this._cachedGraphHash = 0;

    this._errors = [];
    this._warnings = [];
  }

  update(module)
  {
    const graphController = module.getGraphController();
    const machineController = module.getMachineController();
    const graph = this._graph = graphController.getGraph();
    const graphHash = graph.getHashCode(false);
    if (graphHash !== this._cachedGraphHash)
    {
      this._cachedGraphHash = graphHash;
      this.onGraphChange(graph);
    }
  }

  onGraphChange(graph)
  {
    throw new Error("Missing machine update operation for graph change");
  }

  getMachineErrors()
  {
    return this._errors;
  }

  getMachineWarnings()
  {
    return this._warnings;
  }

  isMachineValid()
  {
    return this._errors.length <= 0;
  }

  getMachine()
  {
    throw new Error("Missing machine for builder");
  }
}

export default AbstractMachineBuilder;
