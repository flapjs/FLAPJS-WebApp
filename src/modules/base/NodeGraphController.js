import GraphController from '@flapjs/systems/graph/controller/GraphController.js';

import { GRAPH_EVENT_NODE_EDIT_WHILE_DELETE } from '@flapjs/systems/graph/controller/inputhandler/GraphNodeInputHandler.js';
import { GRAPH_EVENT_EDGE_EDIT_WHILE_DELETE } from '@flapjs/systems/graph/controller/inputhandler/GraphEdgeInputHandler.js';

// import { WARNING_LAYOUT_ID } from 'session/manager/notification/NotificationManager.js';

export const TRASH_EDITING_NOTIFICATION_TAG = 'tryCreateWhileTrash';

class NodeGraphController extends GraphController
{
    constructor(graph, session)
    {
        super(graph);

        this.session = session;
    }

    /** @override */
    onGraphEvent(eventName, eventData)
    {
        super.onGraphEvent(eventName, eventData);

        switch (eventName)
        {
            case GRAPH_EVENT_NODE_EDIT_WHILE_DELETE:
            case GRAPH_EVENT_EDGE_EDIT_WHILE_DELETE:
                /*
                this._app.getNotificationManager().pushNotification(
                    I18N.toString('message.warning.cannotmodify'),
                    WARNING_LAYOUT_ID, TRASH_EDITING_NOTIFICATION_TAG, null, true);
                */
                break;
            default:
                this.session.undoManager.captureEvent();
        }
    }
	
    getApp() { return this._app; }
}

export default NodeGraphController;
