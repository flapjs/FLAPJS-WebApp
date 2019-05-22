import GraphElementInputHandler from './GraphElementInputHandler.js';

const SNAP_TO_GRID = true;
const SNAP_SIZE = 48;

class GraphNodeInputHandler extends GraphElementInputHandler
{
    constructor()
    {
        super('node');
    }

    /** @override */
    onAction(inputController, graphController, pointer, target)
    {
        const picker = inputController.getPicker();

        //Click to delete node
        if (inputController.isTrashMode())
        {
            //So that the emitted 'delete' events can use this
            graphController.prevX = target.x;
            graphController.prevY = target.y;

            //If there exists selected states, delete them all!
            if (picker.hasSelection())
            {
                //Delete all selected nodes
                graphController.deleteSelectedNodes(target);
            }
            else
            {
                //Delete a single node
                graphController.deleteTargetNode(target);
            }
            return true;
        }
        //Edit click to toggle node
        else if (!inputController.isMoveMode())
        {
            graphController.toggleNode(target);
            return true;
        }

        return false;
    }

    /** @override */
    onDragStart(inputController, graphController, pointer, target)
    {
        if (inputController.isMoveMode())
        {
            //Moving node (and selected nodes)
            graphController.prevX = target.x;
            graphController.prevY = target.y;
        }
        else
        {
            const picker = inputController.getPicker();
            const graph = graphController.getGraph();
            const edge = graph.createEdge(target, pointer);
            edge.setEdgeLabel(graphController.getGraphLabeler().getDefaultEdgeLabel());

            //Redirect pointer to refer to the edge as the new target
            picker.setInitialTarget(edge, 'endpoint');
            inputController.isNewEdge = true;

            //Reset previous quad values for new proxy edge
            const edgeQuad = edge.getQuadratic();
            graphController.prevQuad.radians = edgeQuad.radians;
            graphController.prevQuad.length = edgeQuad.length;
            graphController.prevEdgeTo = null;

            //Ready to move proxy edge to pointer...
        }
        return true;
    }

    /** @override */
    onDragMove(inputController, graphController, pointer, target)
    {
        const picker = inputController.getPicker();
        const graph = graphController.getGraph();
        let x = pointer.x;
        let y = pointer.y;

        if (inputController._snapToGrid)
        {
            const snapSize = inputController._snapSize;
            x = Math.round(x / snapSize) * snapSize;
            y = Math.round(y / snapSize) * snapSize;
        }

        if (picker.hasSelection())
        {
            graphController.moveMultipleNodesTo(pointer, picker.getSelection(graph), x, y);
        }
        else
        {
            graphController.moveNodeTo(pointer, target, x, y);
        }
        return true;
    }

    /** @override */
    onDragStop(inputController, graphController, pointer, target)
    {
        const picker = inputController.getPicker();
        const graph = graphController.getGraph();
        const x = pointer.x;
        const y = pointer.y;

        //Delete it if withing trash area...
        if (inputController.isTrashMode())
        {
            //If there exists selected states, delete them all!
            if (picker.hasSelection())
            {
                graphController.deleteSelectedNodes(target);
            }
            else
            {
                //Delete a single node
                graphController.deleteTargetNode(target);
            }

            return true;
        }
        //If dragged to an empty space (not trash)
        else
        {
            //Do nothing, since should have moved to position
            if (picker.hasSelection())
            {
                const dx = x - graphController.prevX;
                const dy = y - graphController.prevY;
                graphController.onGraphIntentMoveAllNodes(picker.getSelection(graph), dx, dy);
                //graphController.emit("nodeMoveAll", graph, picker.getSelection(graph), dx, dy);
            }
            else
            {
                graphController.onGraphIntentMoveNode(target, x, y, graphController.prevX, graphController.prevY);
                //graphController.emit("nodeMove", graph, target, x, y, graphController.prevX, graphController.prevY);
            }
            return true;
        }

        return false;
    }
}

export default GraphNodeInputHandler;
