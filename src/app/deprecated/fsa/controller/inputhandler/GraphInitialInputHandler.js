import GraphElementInputHandler from './GraphElementInputHandler.js';
import GraphNode from 'deprecated/graph/elements/GraphNode.js';

class GraphInitialInputHandler extends GraphElementInputHandler
{
    constructor()
    {
        super('initial');
    }

    /** @override */
    onDragStart(inputController, graphController, pointer, target)
    {
    //Ready to move the initial marker to another state...
        inputController.ghostInitialMarker = pointer;
        return true;
    }

    /** @override */
    onDragMove(inputController, graphController, pointer, target)
    {
        const picker = inputController.getPicker();
        const graph = graphController.getGraph();
        const x = pointer.x;
        const y = pointer.y;
        //Move initial marker to node or pointer
        const dst = picker.getNodeAt(graph, x, y) || pointer;
        inputController.ghostInitialMarker = dst;
        return true;
    }

    /** @override */
    onDragStop(inputController, graphController, pointer, target)
    {
        const graph = graphController.getGraph();

        //If valid initial object to mark...
        if (inputController.ghostInitialMarker instanceof GraphNode)
        {
            const prevInitial = graph.getStartNode();

            //Set the new object as the initial node
            graph.setStartNode(inputController.ghostInitialMarker);
            graphController.applyAutoRename();

            //Emit event
            graphController.onGraphIntentChangeInitial(inputController.ghostInitialMarker, prevInitial);
            //graphController.emit("nodeInitial", graph, inputController.ghostInitialMarker, prevInitial);
        }

        //Reset ghost initial marker
        inputController.ghostInitialMarker = null;
        return true;
    }
}

export default GraphInitialInputHandler;
