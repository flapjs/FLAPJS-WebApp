import GraphController from '@flapjs/systems/graph/controller/GraphController.js';

import { GRAPH_EVENT_NODE_EDIT_WHILE_DELETE, GRAPH_EVENT_NODE_DELETE, GRAPH_EVENT_NODE_DELETE_ALL } from '@flapjs/systems/graph/controller/inputhandler/GraphNodeInputHandler.js';
import { GRAPH_EVENT_EDGE_EDIT_WHILE_DELETE, GRAPH_EVENT_EDGE_DELETE } from '@flapjs/systems/graph/controller/inputhandler/GraphEdgeInputHandler.js';
import { GRAPH_EVENT_START_MARKER_CHANGE } from '@flapjs/systems/graph/controller/inputhandler/IndexedGraphStartMarkerInputHandler.js';

// import { WARNING_LAYOUT_ID } from 'session/manager/notification/NotificationManager.js';
import PDAGraphLabeler from './PDAGraphLabeler.js';

// This really shouldn't be here....
import GraphLayout from '@flapjs/systems/graph/util/GraphLayout.js';
import PDAGraph from '@flapjs/modules/pda/graph/PDAGraph.js';

export const TRASH_EDITING_NOTIFICATION_TAG = 'tryCreateWhileTrash';

const DEFAULT_AUTO_RENAME = true;
const NODE_SPAWN_RADIUS = 64;


class PDAGraphController extends GraphController
{
    constructor()
    {
        super(new PDAGraph());

        this.session = null;

        this.setLabelFormatter(new PDAGraphLabeler().setGraphController(this));

        // This really shouldn't be here...
        this.shouldAutoLabel = DEFAULT_AUTO_RENAME;
    }

    setSession(session)
    {
        this.session = session;
        return this;
    }

    /** @override */
    onGraphEvent(eventName, eventData)
    {
        super.onGraphEvent(eventName, eventData);

        switch (eventName)
        {
            case GRAPH_EVENT_START_MARKER_CHANGE:
            case GRAPH_EVENT_NODE_DELETE:
            case GRAPH_EVENT_NODE_DELETE_ALL:
                if (this.shouldAutoLabel)
                {
                    this.applyAutoRename();
                }
                this._app.getUndoManager().captureEvent();
                break;
            case GRAPH_EVENT_NODE_EDIT_WHILE_DELETE:
            case GRAPH_EVENT_EDGE_EDIT_WHILE_DELETE:
                /*
                this._app.getNotificationManager().pushNotification(
                    I18N.toString('message.warning.cannotmodify'),
                    WARNING_LAYOUT_ID, TRASH_EDITING_NOTIFICATION_TAG, null, true);
                */
                break;
            default:
                this._app.getUndoManager().captureEvent();
        }
    }

    // these really shouldn't be here...

    deleteTargetNodes(targets)
    {
        if (!targets || targets.length <= 0) return;

        const graph = this.getGraph();
        for (const node of targets)
        {
            graph.deleteNode(node);
        }

        //Emit event
        this.emitGraphEvent(GRAPH_EVENT_NODE_DELETE_ALL, { target: targets });
    }

    /**
     * @deprecated
     * @returns {GraphLabeler} The label formatter for the graph.
     */
    getGraphLabeler()
    {
        return this.getLabelFormatter();
    }

    applyAutoLayout()
    {
        GraphLayout.applyLayout(this.getGraph());

        this._app.getUndoManager().captureEvent();
    }

    applyAutoRename()
    {
        const graphLabeler = this._labelFormatter;
        const graph = this._graph;

        if (graph.isEmpty()) return;

        //Reset all default labels...
        for (const node of graph.getNodes())
        {
            if (!node.getNodeCustom()) node.setNodeLabel('');
        }

        //Rename all default labels appropriately...
        for (const node of graph.getNodes())
        {
            if (!node.getNodeCustom())
            {
                node.setNodeLabel(graphLabeler.getDefaultNodeLabel());
            }
        }
    }

    setAutoRenameNodes(enable)
    {
        const prev = this.shouldAutoLabel;
        this.shouldAutoLabel = enable;
        if (enable && !prev)
        {
            this.applyAutoRename();
        }
    }

    shouldAutoRenameNodes()
    {
        return this.shouldAutoLabel;
    }

    deleteSelectedNodes(selectedNode)
    {
        const selectionBox = this.inputController.getSelectionBox();
        const selection = selectionBox.getSelection(this.getGraph()).slice();

        //Remove from graph
        for(const node of selection)
        {
            this._graph.deleteNode(node);
        }

        //Remove from selection
        selectionBox.clearSelection();

        //Emit event
        this.emitGraphEvent(GRAPH_EVENT_NODE_DELETE_ALL, { target: selection });
    }

    deleteTargetNode(target)
    {
        this._graph.deleteNode(target);

        //Emit event
        this.emitGraphEvent(GRAPH_EVENT_NODE_DELETE, { target: target });
    }

    deleteTargetEdge(target)
    {
        this._graph.deleteEdge(target);

        //Emit event
        this.emitGraphEvent(GRAPH_EVENT_EDGE_DELETE, { target: target });
    }

    deleteTargetEdges(targets)
    {
        if (!targets || targets.length <= 0) return;

        for(const target of targets)
        {
            this.deleteTargetEdge(target);
        }
    }

    createNode(x, y)
    {
        if (typeof x === 'undefined') x = (Math.random() * NODE_SPAWN_RADIUS * 2) - NODE_SPAWN_RADIUS;
        if (typeof y === 'undefined') y = (Math.random() * NODE_SPAWN_RADIUS * 2) - NODE_SPAWN_RADIUS;

        const node = this._graph.createNode(x, y);

        const newNodeLabel = this.getGraphLabeler().getDefaultNodeLabel();
        node.setNodeLabel(newNodeLabel);

        this._app.getUndoManager().captureEvent();
        return node;
    }

    renameNode(node, newLabel)
    {
        node.setNodeLabel(newLabel);
        node.setNodeCustom(true);
        this._app.getUndoManager().captureEvent();
    }
}

export default PDAGraphController;
