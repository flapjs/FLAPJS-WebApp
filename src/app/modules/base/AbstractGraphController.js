class AbstractGraphController
{
  constructor(module, graph)
  {
    this._module = module;
    this._graph = graph;

    //throw new Error("Missing implementation for graph controller \'" + this.getModule().getModuleName() + "\'");
  }

  initialize(app) {}
  destroy(app) {}
  update(app) {}

  getGraph()
  {
    return this._graph;
  }

  getModule()
  {
    return this._module;
  }
}

export default AbstractGraphController;
