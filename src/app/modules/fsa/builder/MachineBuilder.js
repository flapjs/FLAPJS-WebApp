import Config from 'config.js';

class MachineBuilder
{
  constructor()
  {
    this.graph = null;
    this.graphController = null;
  }

  initialize(module)
  {
    this.graphController = module.getGraphController();
    this.graph = this.graphController.getGraph();
  }

  destroy(module)
  {

  }

  update(module)
  {

  }
}

export default MachineBuilder;
