class AbstractModuleGraphController
{
  constructor(module, graph, labeler)
  {
    this._module = module;
    this._graph = graph;
    this._labeler = labeler;
    this._labeler.setGraphController(this);

    //throw new Error("Missing implementation for graph controller \'" + this.getModule().getModuleName() + "\'");
  }

  initialize(module) {}
  destroy(module) {}
  update(module) {}

  getGraphLabeler()
  {
    return this._labeler;
  }

  getGraph()
  {
    return this._graph;
  }

  getModule()
  {
    return this._module;
  }
}

export default AbstractModuleGraphController;
