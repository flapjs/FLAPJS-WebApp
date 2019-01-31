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

import Notifications from 'system/notification/Notifications.js';
import SafeGraphEventHandler from 'graph/SafeGraphEventHandler.js';
import StringTester from './tester/StringTester.js';
import FSAErrorChecker from './FSAErrorChecker.js';
import LabelEditor from './editor/LabelEditor.js';

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

    this._workspace = null;

    this._inputController = new InputController(this, app.getInputAdapter());
    this._graphController = new GraphController(this);
    this._machineController = new MachineController(this);

    this._undoManager = app.getUndoManager();
    this._errorChecker = new FSAErrorChecker(this._graphController, this._machineController);
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

  getLabelEditor()
  {
    return LabelEditor;
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
  getLocalizedModuleName() { return this._machineController.getMachineType(); }
}

export default FSAModule;
