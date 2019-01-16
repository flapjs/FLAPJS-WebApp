import AbstractModule from 'modules/abstract/AbstractModule.js';

import DefaultGraphExporter from './DefaultGraphExporter.js';

import DefaultInputController from './DefaultInputController.js';
import DefaultGraphController from './DefaultGraphController.js';
import DefaultMachineController from './DefaultMachineController.js';

import DefaultPanel from './DefaultPanel.js';
import DefaultGraphRenderer from './DefaultGraphRenderer.js';
import DefaultGraphOverlayRenderer from './DefaultGraphOverlayRenderer.js';
import DefaultViewportRenderer from './DefaultViewportRenderer.js';

import DefaultLabelEditor from './DefaultLabelEditor.js';

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

  getLabelEditor()
  {
    return DefaultLabelEditor;
  }

  //Override
  initialize(app)
  {
    super.initialize(app);
  }

  //Override
  destroy(app)
  {
    super.destroy(app);
  }

  //Override
  update(app)
  {
    super.update(app);
  }

  //Override
  getRenderer(renderLayer)
  {
    switch(renderLayer)
    {
      case "graph":
        return DefaultGraphRenderer;
      case "graphoverlay":
        return DefaultGraphOverlayRenderer;
      case "viewport":
        return DefaultViewportRenderer;
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
