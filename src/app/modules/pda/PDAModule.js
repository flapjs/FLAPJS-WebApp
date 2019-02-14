import AbstractModule from 'modules/abstract/AbstractModule.js';

import InputController from './controller/InputController.js';
import GraphController from './controller/GraphController.js';
import MachineController from './controller/MachineController.js';

import PDAGraphRenderer from './renderer/PDAGraphRenderer.js';
import PDAGraphOverlayRenderer from './renderer/PDAGraphOverlayRenderer.js';
import PDALabelEditorRenderer from './renderer/PDALabelEditorRenderer.js';

import AboutPanel from './components/panels/about/AboutPanel.js';
import OverviewPanel from './components/panels/overview/OverviewPanel.js';
import TestingPanel from './components/panels/testing/TestingPanel.js';
import AnalysisPanel from './components/panels/analysis/AnalysisPanel.js';

import Notifications from 'system/notification/Notifications.js';
import SafeGraphEventHandler from 'graph/SafeGraphEventHandler.js';
import StringTester from './tester/StringTester.js';
import PDAErrorChecker from './PDAErrorChecker.js';

const MODULE_NAME = "pda";
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

class PDAModule extends AbstractModule
{
  constructor(app)
  {
    super(app);

    this._workspace = null;

    this._inputController = new InputController(this, app.getInputAdapter());
    this._graphController = new GraphController(this);
    this._machineController = new MachineController(this);

    this._undoManager = app.getUndoManager();
    this._errorChecker = new PDAErrorChecker(this._graphController, this._machineController);
    this._tester = new StringTester();
  }

  //Override
  initialize(app)
  {
    this._workspace = app.workspace;

    super.initialize(app);

    //Notify on create in delete mode
    const tryCreateWhileTrash = () => {
      if (this._inputController.isTrashMode())
      {
        Notifications.addMessage(I18N.toString("message.warning.cannotmodify"), "warning", "tryCreateWhileTrash");
      }
    };
    this._graphController.on("tryCreateWhileTrash", tryCreateWhileTrash);
  }

  captureGraphEvent()
  {
    this._undoManager.captureEvent(new SafeGraphEventHandler(this._graphController));
  }

  //Override
  getRenderer(renderLayer)
  {
    switch(renderLayer)
    {
      case "graph":
        return PDAGraphRenderer;
      case "graphoverlay":
        return PDAGraphOverlayRenderer;
      case "labeleditor":
        return PDALabelEditorRenderer;
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
  getLocalizedModuleName() { return "PDA"; }
}

export default PDAModule;
