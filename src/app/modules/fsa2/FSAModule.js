import AbstractModule from 'modules/abstract/AbstractModule.js';

import InputController from './controller/InputController.js';
import GraphController from './controller/GraphController.js';
import MachineController from './controller/MachineController.js';

import GraphRenderer from './renderer/GraphRenderer.js';
import GraphOverlayRenderer from './renderer/GraphOverlayRenderer.js';

import AboutPanel from 'experimental/panels/about/AboutPanel.js';
import OverviewPanel from 'experimental/panels/overview/OverviewPanel.js';
import TestingPanel from 'experimental/panels/testing/TestingPanel.js';
import AnalysisPanel from 'experimental/panels/analysis/AnalysisPanel.js';

const MODULE_NAME = "fsa";
const MODULE_VERSION = "0.0.1";
const MODULE_PANELS = [AboutPanel, OverviewPanel, TestingPanel, AnalysisPanel];
const MODULE_MENUS = [];
const MODULE_VIEWS = [];

class FSAModule extends AbstractModule
{
  constructor(app)
  {
    super(app);

    this._inputController = new InputController(this, app.getInputAdapter());
    this._graphController = new GraphController(this);
    this._machineController = new MachineController(this);
  }

  //Override
  getRenderer(renderLayer)
  {
    switch(renderLayer)
    {
      case "graph":
        return GraphRenderer;
      case "graphoverlay":
        return GraphOverlayRenderer;
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
  getModulePanels() { return MODULE_PANELS; }
  //Override
  getModuleViews() { return MODULE_VIEWS; }
  //Override
  getModuleMenus() { return MODULE_MENUS; }
  //Override
  getModuleVersion() { return MODULE_VERSION; }
  //Override
  getModuleName() { return MODULE_NAME; }
  //Override
  getLocalizedModuleName() { return /*the machine type name*/ "FSA"; }
}

export default FSAModule;
