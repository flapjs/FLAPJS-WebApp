import GraphController from 'graph2/controller/GraphController.js';

import NodeGraphChangeHandler from 'graph2/NodeGraphChangeHandler.js';
// import SafeUndoNodeGraphEventHandler from 'graph2/SafeUndoNodeGraphEventHandler.js';

import { GRAPH_EVENT_NODE_EDIT_WHILE_DELETE } from 'graph2/inputs/GraphNodeInputHandler.js';
import { GRAPH_EVENT_EDGE_EDIT_WHILE_DELETE } from 'graph2/inputs/GraphEdgeInputHandler.js';

import { WARNING_LAYOUT_ID } from 'session/manager/notification/NotificationManager.js';
import FSAGraphLabeler from './FSAGraphLabeler';

export const TRASH_EDITING_NOTIFICATION_TAG = 'tryCreateWhileTrash';

class NodeGraphController extends GraphController
{
    constructor(app, graph, graphParser)
    {
        super(graph);

        this._app = app;

        this.setGraphChangeHandler(new NodeGraphChangeHandler());
        this.setLabelFormatter(new FSAGraphLabeler().setGraphController(this));

        /*
        app.getUndoManager().setEventHandlerFactory(
            (...args) => new SafeUndoNodeGraphEventHandler(graph, graphParser));
        */
    }

    /** @override */
    onGraphEvent(eventName, eventData)
    {
        super.onGraphEvent(eventName, eventData);

        switch (eventName)
        {
        case GRAPH_EVENT_NODE_EDIT_WHILE_DELETE:
        case GRAPH_EVENT_EDGE_EDIT_WHILE_DELETE:
            this._app.getNotificationManager().pushNotification(
                I18N.toString('message.warning.cannotmodify'),
                WARNING_LAYOUT_ID, TRASH_EDITING_NOTIFICATION_TAG, null, true);
            break;
        default:
            this._app.getUndoManager().captureEvent();
        }
    }

    shouldAutoRenameNodes()
    {
        return true;
    }
	
    getApp() { return this._app; }
}

export default NodeGraphController;