import Config from 'config.js';
import MachineLabeler from './MachineLabeler.js';

class MachineBuilder
{
  constructor(graph)
  {
    this.graph = graph;

    //TODO: this is hooked into the controller in App.js
    this.shouldAutomaticallyRenameNodes = true;
    this.labeler = new MachineLabeler(graph);
  }

  getLabeler()
  {
    return this.labeler;
  }
}

export default MachineBuilder;
