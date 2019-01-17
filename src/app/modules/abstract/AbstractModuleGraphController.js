class AbstractModuleGraphController
{
  constructor(module, graph, labeler)
  {
    if (!module) throw new Error("Missing module for graph controller");
    if (!graph) throw new Error("Missing graph for graph controller");
    if (!labeler) throw new Error("Missing graph labeler for graph controller");

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
