import AbstractModule from 'modules/abstract/AbstractModule.js';

import DefaultGraphExporter from './DefaultGraphExporter.js';

import DefaultInputController from './DefaultInputController.js';
import DefaultGraphController from './DefaultGraphController.js';
import DefaultMachineController from './DefaultMachineController.js';

import DefaultPanel from './DefaultPanel.js';
import DefaultGraphRenderer from './DefaultGraphRenderer.js';

import Notifications from 'system/notification/Notifications.js';

const VERSION = "0.0.1";
const PANELS = [DefaultPanel];
const EXPORTERS = [new DefaultGraphExporter()];

class DefaultModule extends AbstractModule
{
  constructor(app)
  {
    super(app);

    const inputAdapter = app.getInputAdapter();
    this._inputController = new DefaultInputController(this, inputAdapter);
    this._graphController = new DefaultGraphController(this);
    this._machineController = new DefaultMachineController(this);
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
        return DefaultGraphRenderer;
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
  getModuleName() { return "default"; }
  //Override
  getLocalizedModuleName() { return "Default"; }
}

export default DefaultModule;
