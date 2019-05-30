import GraphController from 'graph2/controller/GraphController.js';

import { GRAPH_EVENT_NODE_EDIT_WHILE_DELETE, GRAPH_EVENT_NODE_DELETE, GRAPH_EVENT_NODE_DELETE_ALL } from 'graph2/inputhandler/GraphNodeInputHandler.js';
import { GRAPH_EVENT_EDGE_EDIT_WHILE_DELETE, GRAPH_EVENT_EDGE_DELETE, GRAPH_EVENT_EDGE_CREATE } from 'graph2/inputhandler/GraphEdgeInputHandler.js';
import { GRAPH_EVENT_START_MARKER_CHANGE } from 'graph2/inputhandler/IndexedGraphStartMarkerInputHandler.js';

import { WARNING_LAYOUT_ID } from 'session/manager/notification/NotificationManager.js';
import FSAGraphLabeler from './FSAGraphLabeler';

import { SYMBOL_SEPARATOR } from './element/FSAEdge.js';

export const TRASH_EDITING_NOTIFICATION_TAG = 'tryCreateWhileTrash';


// This really shouldn't be here....
import GraphLayout from 'modules/fsa2/GraphLayout.js';
const DEFAULT_AUTO_RENAME = true;
const NODE_SPAWN_RADIUS = 64;


class FSAGraphController extends GraphController
{
    constructor(app, graph, graphParser)
    {
        super(graph);

        this._app = app;

        this.setLabelFormatter(new FSAGraphLabeler().setGraphController(this));


        // This really shouldn't be here...

        this.shouldAutoLabel = DEFAULT_AUTO_RENAME;
    }

    /** @override */
    onGraphEvent(eventName, eventData)
    {
        super.onGraphEvent(eventName, eventData);

        switch (eventName)
        {
        case GRAPH_EVENT_EDGE_CREATE:
            formatEdge(this.getGraph(), eventData.target);
            break;
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
            this._app.getNotificationManager().pushNotification(
                I18N.toString('message.warning.cannotmodify'),
                WARNING_LAYOUT_ID, TRASH_EDITING_NOTIFICATION_TAG, null, true);
            break;
        default:
            this._app.getUndoManager().captureEvent();
        }
    }

    getApp() { return this._app; }

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

    /** @deprecated */
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


//This is more like addEdge() without adding it to the graph and just returns the result
//This should only be called once when completing an edge
/** @override */
function formatEdge(graph, edge)
{
    const PARALLEL_EDGE_HEIGHT = 16;
    const edgeSource = edge.getEdgeFrom();
    const edgeDestination = edge.getEdgeTo();
    const edgeLabel = edge.getEdgeLabel().split(SYMBOL_SEPARATOR);

    //Look for an existing edge with similar from and to
    for (const otherEdge of graph.getEdges())
    {
        if (otherEdge === edge) continue;
        if (otherEdge.getEdgeFrom() === edgeSource && otherEdge.getEdgeTo() === edgeDestination)
        {
            const otherSymbols = otherEdge.getEdgeSymbolsFromLabel();
            if (edgeLabel.length > 0)
            {
                const result = otherSymbols.concat(edgeLabel);
                otherEdge.setEdgeLabel(result.join(SYMBOL_SEPARATOR));
            }

            //Merged with newfound edge...
            return otherEdge;
        }
    }

    //Otherwise, format the current edge

    if (!edge.isSelfLoop())
    {
        let flag = false;

        //Bend away if there is another edge not bent with the same src/dst
        const parallelEdgeHeight = PARALLEL_EDGE_HEIGHT;
        const HALFPI = Math.PI / 2;
        for (const otherEdge of graph.getEdges())
        {
            if (otherEdge.isQuadratic() && Math.abs(otherEdge.getQuadratic().length) >= parallelEdgeHeight * 2) continue;
            if ((otherEdge.getEdgeTo() === edgeSource && otherEdge.getEdgeFrom() === edgeDestination))
            {
                edge.setQuadraticRadians(HALFPI).setQuadraticLength(parallelEdgeHeight);
                otherEdge.setQuadraticRadians(HALFPI).setQuadraticLength(parallelEdgeHeight);
                flag = true;

                //ASSUMES that there will only ever be 2 edges that are parallel...
                break;
            }
        }

        //Try to move the edge away from intersecting nodes...
        if (!flag)
        {
            const maxNodeSize = Math.max(edgeSource.getNodeSize(), edgeDestination.getNodeSize());
            const x1 = edgeSource.x;
            const y1 = edgeSource.y;
            const x2 = edgeDestination.x;
            const y2 = edgeDestination.y;
            const dist12sq = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
            let vertical = false;
            let m = 0;
            let b = 0;

            if (x1 > x2)
            {
                m = (y1 - y2) / (x1 - x2);
                b = y2 - m * x2;
            }
            else if (x1 < x2)
            {
                m = (y2 - y1) / (x2 - x1);
                b = y1 - m * x1;
            }
            else
            {
                vertical = true;
            }

            for (const node of graph.getNodes())
            {
                if (node === edgeSource || node === edgeDestination) continue;

                const x0 = node.x;
                const y0 = node.y;

                const dist01sq = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
                const dist02sq = (x2 - x0) * (x2 - x0) + (y2 - y0) * (y2 - y0);
                if (dist01sq > dist12sq || dist02sq > dist12sq) continue;

                let dist = 0;
                if (vertical)
                {
                    dist = Math.abs(x1 - x0);
                }
                else
                {
                    dist = Math.abs(b + m * x0 - y0) / Math.sqrt(1 + m * m);
                }

                if (dist < node.getNodeSize())
                {
                    flag = true;
                    break;
                }
            }

            if (flag)
            {
                edge.setQuadraticRadians(-Math.PI / 2);
                edge.setQuadraticLength(maxNodeSize + 10);
            }
        }
    }

    return edge;
}

export default FSAGraphController;