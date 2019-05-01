import InputController from 'modules/nodalgraph/controller/InputController.js';
import GraphController from 'modules/nodalgraph/controller/GraphController.js';

import SelectionBoxInputHandler from 'modules/nodalgraph/controller/SelectionBoxInputHandler.js';
import ViewportInputHandler from 'modules/nodalgraph/controller/ViewportInputHandler.js';

import LabelEditorManager from 'session/manager/labeleditor/LabelEditorManager.js';

import {WARNING_LAYOUT_ID} from 'session/manager/notification/NotificationManager.js';

export const TRASH_EDITING_NOTIFICATION_TAG = 'tryCreateWhileTrash';

class NodalGraphInputManager
{
    constructor(currentModule, nodalGraph, graphLabeler, graphParser, labelEditorRenderer)
    {
        this._inputController = new InputController(currentModule, currentModule.getApp().getInputAdapter());
        this._graphController = new GraphController(currentModule, nodalGraph, graphLabeler, graphParser);

        this._labelEditorManager = new LabelEditorManager(currentModule.getApp())
            .setLabelEditorRenderer(labelEditorRenderer)
            .setLabeler(graphLabeler);

        this._selectionBoxInputHandler = new SelectionBoxInputHandler(this._inputController, this._graphController, this._inputController.getSelectionBox());
        this._viewportInputHandler = new ViewportInputHandler();
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
        const app = session.getApp();
        const currentModule = session.getCurrentModule();

        currentModule.getApp().getInputAdapter()
            .addInputHandler(this._inputController)
            .addInputHandler(this._selectionBoxInputHandler)
            .addInputHandler(this._viewportInputHandler);

        const inputController = this.getInputController();
        const graphController = this.getGraphController();
        inputController.initialize(currentModule);
        graphController.initialize(currentModule);

        this._labelEditorManager.onSessionStart(session);

        //Notify on create in delete mode
        const tryCreateWhileTrash = () => 
        {
            if (this._inputController.isTrashMode())
            {
                app.getNotificationManager().pushNotification(
                    I18N.toString('message.warning.cannotmodify'),
                    WARNING_LAYOUT_ID, TRASH_EDITING_NOTIFICATION_TAG, null, true);
            }
        };
        this._graphController.on('tryCreateWhileTrash', tryCreateWhileTrash);
    }

    //DuckType(SessionListener)
    onSessionStop(session)
    {
        session.getApp().getInputAdapter()
            .removeInputHandler(this._inputController)
            .removeInputHandler(this._selectionBoxInputHandler)
            .removeInputHandler(this._viewportInputHandler);

        this._labelEditorManager.onSessionStop(session);

        const currentModule = session.getCurrentModule();
        const inputController = this.getInputController();
        const graphController = this.getGraphController();
        graphController.destroy(currentModule);
        inputController.destroy(currentModule);
    }

    getLabelEditorManager() { return this._labelEditorManager; }
    getGraphParser() { return this._graphController.getGraphParser(); }
    getGraphLabeler() { return this._graphController.getGraphLabeler(); }
    getGraphController() { return this._graphController; }
    getInputController() { return this._inputController; }
}

export default NodalGraphInputManager;
