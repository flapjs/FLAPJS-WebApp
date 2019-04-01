import AbstractModule from 'modules/abstract/AbstractModule.js';

import InputController from './controller/InputController.js';
import GraphController from './controller/GraphController.js';
import MachineController from './controller/MachineController.js';

import NodalGraphRenderer from 'graph/renderer/NodalGraphRenderer.js';
import DefaultGraphOverlayRenderer from './renderer/DefaultGraphOverlayRenderer.js';

import AboutPanel from './components/panels/about/AboutPanel.js';

import Notifications from 'deprecated/system/notification/Notifications.js';
import SafeGraphEventHandler from 'deprecated/system/undomanager/SafeGraphEventHandler.js';

const MODULE_NAME = "default";
const MODULE_VERSION = "0.0.1";
const MODULE_PANELS = [
  AboutPanel
];
const MODULE_MENUS = [

];
const MODULE_VIEWS = [

];

//DEPRECATED! - use NodalGraphModule instead
class DefaultModule extends AbstractModule
{
  constructor(app)
  {
    super(app);

    this._workspace = null;

    this._inputController = new InputController(this, app.getInputAdapter());
    this._graphController = new GraphController(this);
    this._machineController = new MachineController(this);

    this._undoManager = app.getUndoManager();
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
        return NodalGraphRenderer;
      case "graphoverlay":
        return DefaultGraphOverlayRenderer;
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
  getLocalizedModuleName() { return "Default"; }
}

export default DefaultModule;
