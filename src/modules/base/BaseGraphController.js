import GraphController from '@flapjs/systems/graph/controller/GraphController.js';

import IndexedNodeGraph from '@flapjs/systems/graph/model/IndexedNodeGraph.js';
import GraphNode from '@flapjs/systems/graph/model/elements/GraphNode.js';
import QuadraticEdge from '@flapjs/systems/graph/model/elements/QuadraticEdge.js';

import { GRAPH_EVENT_NODE_EDIT_WHILE_DELETE } from '@flapjs/systems/graph/controller/inputhandler/GraphNodeInputHandler.js';
import { GRAPH_EVENT_EDGE_EDIT_WHILE_DELETE } from '@flapjs/systems/graph/controller/inputhandler/GraphEdgeInputHandler.js';

// import { WARNING_LAYOUT_ID } from 'session/manager/notification/NotificationManager.js';

export const TRASH_EDITING_NOTIFICATION_TAG = 'tryCreateWhileTrash';

class BaseGraphController extends GraphController
{
    constructor()
    {
        super(new IndexedNodeGraph(GraphNode, QuadraticEdge));

        this.session = null;
    }

    setSession(session)
    {
        this.session = session;
        return this;
    }

    /** @override */
    emitGraphEvent(eventName, eventData)
    {
        super.emitGraphEvent(eventName, eventData);

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
}

export default BaseGraphController;
