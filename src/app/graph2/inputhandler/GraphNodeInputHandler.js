import AbstractInputHandler from 'util/input/AbstractInputHandler.js';
import { lerp } from 'util/MathHelper.js';
import { EVENT_SOURCE_NODE } from 'graph2/renderer/NodeRenderer.js';

export const GRAPH_EVENT_NODE_CREATE = 'node-create';
export const GRAPH_EVENT_NODE_DELETE = 'node-delete';
export const GRAPH_EVENT_NODE_DELETE_ALL = 'node-delete-all';
export const GRAPH_EVENT_NODE_LABEL_CHANGE = 'edge-label-change';
export const GRAPH_EVENT_NODE_MOVE = 'node-move';
export const GRAPH_EVENT_NODE_MOVE_ALL = 'node-move-all';
export const GRAPH_EVENT_NODE_EDIT_WHILE_DELETE = 'error-node-edit-while-delete';

const NODE_POSITION_INTERPOLATION_DELTA = 0.6;
const SHOULD_DELETE_NODE_WITH_EMPTY_LABEL = false;

class GraphNodeInputHandler extends AbstractInputHandler
{
    constructor(inputController, graphController)
    {
        super();
        this._inputController = inputController;
        this._graphController = graphController;

        this._cachedPosition = { x: 0, y: 0 };
    }

    /** @override */
    onInputEvent(pointer)
    {
        const inputController = this._inputController;
        const currentTargetType = inputController.getCurrentTargetType();

        if (inputController.isTrashMode())
        {
            if (currentTargetType === EVENT_SOURCE_NODE)
            {
                const currentTargetSource = inputController.getCurrentTargetSource();
                const graphController = this._graphController;
                graphController.getGraph().deleteNode(currentTargetSource);
                graphController.emitGraphEvent(GRAPH_EVENT_NODE_DELETE, { target: currentTargetSource });
                return true;
            }
        }

        if (!inputController.isMoveMode(pointer.getInputAdapter()) && currentTargetType === EVENT_SOURCE_NODE)
        {
            const currentTargetSource = inputController.getCurrentTargetSource();
            const graphController = this._graphController;
            graphController.openLabelEditor(currentTargetSource, currentTargetSource.getNodeLabel(),
                (target, value, hasChanged) => 
                {
                    if (SHOULD_DELETE_NODE_WITH_EMPTY_LABEL && !value)
                    {
                        graphController.getGraph().deleteNode(currentTargetSource);
                        graphController.emitGraphEvent(GRAPH_EVENT_NODE_DELETE, { target: currentTargetSource });
                    }
                    else if (hasChanged)
                    {
                        graphController.emitGraphEvent(GRAPH_EVENT_NODE_LABEL_CHANGE, { target: currentTargetSource });
                    }
                });
            return true;
        }

        return false;
    }

    /** @override */
    onAltInputEvent(pointer)
    {
        return this.onInputEvent(pointer);
    }

    /** @override */
    onDblInputEvent(pointer)
    {
        const inputController = this._inputController;
        if (inputController.hasActiveTarget()) return false;
        if (inputController.isTrashMode()) return false;

        const currentTargetType = inputController.getCurrentTargetType();
        if (!currentTargetType)
        {
            const graphController = this._graphController;
            const labelFormatter = graphController.getLabelFormatter();
            const graph = graphController.getGraph();
            const node = graph.createNode(pointer.x, pointer.y);
            if (labelFormatter)
            {
                node.setNodeLabel(labelFormatter.getDefaultNodeLabel());
            }
            graphController.emitGraphEvent(GRAPH_EVENT_NODE_CREATE, { target: node });
        }
    }

    /** @override */
    onDragStart(pointer)
    {
        const inputController = this._inputController;
        if (inputController.hasActiveTarget()) return false;
        if (inputController.isTrashMode())
        {
            // Don't delete stuff if moving...
            this._graphController.emitGraphEvent(GRAPH_EVENT_NODE_EDIT_WHILE_DELETE);
            return false;
        }
        
        const currentTargetType = inputController.getCurrentTargetType();
        if (inputController.isMoveMode(pointer.getInputAdapter()) && currentTargetType === EVENT_SOURCE_NODE)
        {
            const selectionBox = inputController.getSelectionBox();
            const currentTargetSource = inputController.getCurrentTargetSource();
            if (selectionBox && selectionBox.hasSelection())
            {
                if (!selectionBox.isTargetInSelection(currentTargetSource))
                {
                    selectionBox.clearSelection();
                }
                else
                {
                    this._cachedPosition.x = pointer.x;
                    this._cachedPosition.y = pointer.y;
                }
            }
            inputController.bindActiveTarget(currentTargetSource, currentTargetType, false);
            return true;
        }

        return false;
    }

    /** @override */
    onDragMove(pointer)
    {
        const inputController = this._inputController;
        const selectionBox = inputController.getSelectionBox();
        const targetSource = inputController.getActiveTargetSource();
        if (selectionBox && selectionBox.hasSelection())
        {
            const dx = pointer.x - this._cachedPosition.x;
            const dy = pointer.y - this._cachedPosition.y;
            for (const node of selectionBox.getSelection())
            {
                node.x += dx;
                node.y += dy;
            }
            this._cachedPosition.x = pointer.x;
            this._cachedPosition.y = pointer.y;
        }
        else
        {
            this.moveNodeTo(this._graphController.getGraph(), targetSource, pointer.x, pointer.y);
        }
    }

    /** @override */
    onDragStop(pointer)
    {
        const inputController = this._inputController;
        const graphController = this._graphController;
        const selectionBox = inputController.getSelectionBox();

        const targetSource = inputController.getActiveTargetSource();
        inputController.unbindActiveTarget();

        if (inputController.isTrashMode())
        {
            if (selectionBox.hasSelection())
            {
                const graph = graphController.getGraph();
                const dst = [];
                for (const node of selectionBox.getSelection())
                {
                    graph.deleteNode(node);
                    dst.push(node);
                }
                selectionBox.clearSelection();
                graphController.emitGraphEvent(GRAPH_EVENT_NODE_DELETE_ALL, { target: dst });
            }
            else
            {
                graphController.getGraph().deleteNode(targetSource);
                graphController.emitGraphEvent(GRAPH_EVENT_NODE_DELETE, { target: targetSource });
            }
            return;
        }

        if (selectionBox.hasSelection())
        {
            graphController.emitGraphEvent(GRAPH_EVENT_NODE_MOVE_ALL, { target: selectionBox.getSelection() });
        }
        else
        {
            graphController.emitGraphEvent(GRAPH_EVENT_NODE_MOVE, { target: targetSource });
        }
    }

    moveNodeTo(graph, node, x, y)
    {
        x = lerp(node.x, x, NODE_POSITION_INTERPOLATION_DELTA);
        y = lerp(node.y, y, NODE_POSITION_INTERPOLATION_DELTA);

        const nodeSize = node.getNodeSize();
        for (const other of graph.getNodes())
        {
            //Update node collision
            if (node === other) continue;

            const dx = x - other.x;
            const dy = y - other.y;
            const angle = Math.atan2(dy, dx);

            const diameter = (nodeSize * 2);
            const nextDX = other.x + (Math.cos(angle) * diameter) - x;
            const nextDY = other.y + (Math.sin(angle) * diameter) - y;

            if (dx * dx + dy * dy < nodeSize * nodeSize * 4)
            {
                x += nextDX;
                y += nextDY;
            }
        }

        node.x = x;
        node.y = y;
    }
}

export default GraphNodeInputHandler;