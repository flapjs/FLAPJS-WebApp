import Config from 'config.js';
import MachineLabeler from './MachineLabeler.js';

class MachineBuilder
{
  //HACK: this should not take app
  constructor(graph, app)
  {
    this.graph = graph;
    this.controller = app.controller;

    this.shouldAutomaticallyRenameNodes = true;
    this.labeler = new MachineLabeler(graph);

    this._labelSort = this.labeler.sortDefaultNodeLabels.bind(this.labeler);
    this.controller.on("nodeDelete", this._labelSort);
    this.controller.on("nodeDeleteAll", this._labelSort);
    this.controller.on("nodeInitial", this._labelSort);
    this.controller.on("nodeLabel", this._labelSort);
  }

  getLabeler()
  {
    return this.labeler;
  }
}

export default MachineBuilder;
