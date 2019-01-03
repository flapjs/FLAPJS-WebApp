import AbstractModule from 'modules/abstract/AbstractModule.js';

import HLSMGraphRenderer from './renderer/HLSMGraphRenderer.js';
import HLSMGraphExporter from './HLSMGraphExporter.js';

import InputController from './controller/InputController.js';
import GraphController from './controller/GraphController.js';
import MachineController from './controller/MachineController.js';

const VERSION = "0.0.1";
const PANELS = [];
const EXPORTERS = [new HLSMGraphExporter()];

class HLSMModule extends AbstractModule
{
  constructor()
  {
    super();

    const inputAdapter = app.getInputAdapter();
    this._inputController = new InputController(this, inputAdapter);
    this._graphController = new GraphController(this);
    this._machineController = new MachineController(this);
  }

  //Override
  initialize(app)
  {
    super.initialize(app);

    this._inputController.initialize(this);
    this._graphController.initialize(this);
    this._machineController.initialize(this);
  }

  //Override
  destroy(app)
  {
    this._machineController.destroy(this);
    this._graphController.destroy(this);
    this._inputController.destroy(this);

    super.destroy(app);
  }

  //Override
  update(app)
  {
    this._inputController.update(this);
    this._graphController.update(this);
    this._machineController.update(this);
  }

  //Override
  getRenderer(renderLayer)
  {
    switch(renderLayer)
    {
      case "graph":
        return HLSMGraphRenderer;
      case "graphoverlay":
        //return GraphOverlayRenderer;
      case "viewport":
        //return ViewportRenderer;
    }
    return null;
  }
  //Override
  getInputController() { return this._inputController; }
  //Override
  getGraphController() { return this._graphController; }
  //Override
  getMachineController() { return this._machineController; }
  //Override
  getGraphExporters() { return EXPORTERS; }
  //Override
  getModuleVersion() { return VERSION; }
  //Override
  getModulePanels() { return PANELS; }
  //Override
  getModuleName() { return "hlsm"; }
  //Override
  getLocalizedModuleName() { return "HLSM"; }
}

export default HLSMModule;
