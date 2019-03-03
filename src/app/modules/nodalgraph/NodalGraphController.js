import GraphChangeHandler from 'experimental/GraphChangeHandler.js';

const GRAPH_REFRESH_RATE = 30;

class NodalGraphController
{
  constructor(currentModule, nodalGraph)
  {
    this._module = currentModule;
    this._nodalGraph = nodalGraph;
    this._graphChangeHandler = new GraphChangeHandler(GRAPH_REFRESH_RATE);
  }

  initialize(currentModule)
  {
  }

  update(currentModule)
  {
    this._graphChangeHandler.update(this._nodalGraph);
  }

  destroy(currentModule)
  {
  }

  getGraphChangeHandler() { return this._graphChangeHandler; }
  getGraph() { return this._nodalGraph; }
  getModule() { return this._module; }
}

export default NodalGraphController;
