import AbstractModule from 'modules/abstract/AbstractModule.js';

import InputController from './controller/InputController.js';
import GraphController from './controller/GraphController.js';
import MachineController from './controller/MachineController.js';

import FSAGraphRenderer from './renderer/FSAGraphRenderer.js';
import FSAGraphOverlayRenderer from './renderer/FSAGraphOverlayRenderer.js';

import AboutPanel from './components/panels/about/AboutPanel.js';
import OverviewPanel from './components/panels/overview/OverviewPanel.js';
import TestingPanel from './components/panels/testing/TestingPanel.js';
import AnalysisPanel from './components/panels/analysis/AnalysisPanel.js';

const MODULE_NAME = "fsa";
const MODULE_VERSION = "0.0.1";
const MODULE_PANELS = [
  AboutPanel,
  OverviewPanel,
  TestingPanel,
  AnalysisPanel
];
const MODULE_MENUS = [

];
const MODULE_VIEWS = [

];

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
        return FSAGraphRenderer;
      case "graphoverlay":
        return FSAGraphOverlayRenderer;
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
  getLocalizedModuleName() { return /*TODO: the machine type name*/ "FSA"; }
}

export default FSAModule;
