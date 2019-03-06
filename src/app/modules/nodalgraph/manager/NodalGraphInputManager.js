import InputController from 'modules/nodalgraph/controller/InputController.js';
import GraphController from 'modules/nodalgraph/controller/GraphController.js';

import SelectionBoxInputHandler from 'modules/nodalgraph/controller/SelectionBoxInputHandler.js';
import ViewportInputHandler from 'modules/nodalgraph/controller/ViewportInputHandler.js';

import LabelEditorManager from 'manager/labeleditor/LabelEditorManager.js';

import Notifications from 'system/notification/Notifications.js';

class NodalGraphInputManager
{
  constructor(currentModule, nodalGraph, graphLabeler, graphParser, labelEditorRenderer)
  {
    this._inputController = new InputController(currentModule, currentModule.getApp().getInputAdapter());
    this._graphController = new GraphController(currentModule, nodalGraph, graphLabeler, graphParser);

    this._labelEditorManager = new LabelEditorManager()
      .setLabelEditorRenderer(labelEditorRenderer)
      .setLabeler(graphLabeler);

    currentModule.getApp().getInputAdapter()
      .addInputHandler(this._inputController)
      .addInputHandler(new SelectionBoxInputHandler(this._inputController, this._graphController, this._inputController.getSelectionBox()))
      .addInputHandler(new ViewportInputHandler());
  }

  //Not yet implemented
  setGraphLabeler(labeler)
  {
    this._graphLabeler = labeler;
    return this;
  }

  //Not yet implemented
  setGraphParser(parser)
  {
    this._graphParser = parser;
    return this;
  }

  update(currentModule)
  {
    const inputController = this.getInputController();
    const graphController = this.getGraphController();
    inputController.update(currentModule);
    graphController.update(currentModule);
  }

  //DuckType(SessionListener)
  onSessionStart(session)
  {
    const inputController = this.getInputController();
    const graphController = this.getGraphController();
    inputController.initialize(this);
    graphController.initialize(this);
    
    this._labelEditorManager.onSessionStart(session);

    //Notify on create in delete mode
    const tryCreateWhileTrash = () => {
      if (this._inputController.isTrashMode())
      {
        Notifications.addMessage(I18N.toString("message.warning.cannotmodify"), "warning", "tryCreateWhileTrash");
      }
    };
    this._graphController.on("tryCreateWhileTrash", tryCreateWhileTrash);
  }

  //DuckType(SessionListener)
  onSessionStop(session)
  {
    this._labelEditorManager.onSessionStop(session);

    const inputController = this.getInputController();
    const graphController = this.getGraphController();
    graphController.destroy(session.getCurrentModule());
    inputController.destroy(session.getCurrentModule());
  }

  getLabelEditorManager() { return this._labelEditorManager; }
  getGraphParser() { return this._graphController.getGraphParser(); }
  getGraphLabeler() { return this._graphController.getGraphLabeler(); }
  getGraphController() { return this._graphController; }
  getInputController() { return this._inputController; }
}

export default NodalGraphInputManager;
