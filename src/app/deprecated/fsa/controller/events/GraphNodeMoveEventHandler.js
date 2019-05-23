import EventHandler from './EventHandler.js';

class GraphNodeMoveEventHandler extends EventHandler
{
    constructor(eventLogger, graphController)
    {
        super(eventLogger, graphController, 'nodeMove');
    }

    /** @override */
    captureEvent(graph, targetNode, nextX, nextY, prevX, prevY)
    {
        return {
            graph: graph,
            nodeID: targetNode.getGraphElementID(),
            nextX: nextX,
            nextY: nextY,
            prevX: prevX,
            prevY: prevY
        };
    }

    //Override - this = event
    applyUndo(e)
    {
        const graph = this.controller.getGraph();
        const node = graph.getNodeByElementID(e.eventData.nodeID);
        if (!node) throw new Error('Unable to find target in graph');

        node.x = e.eventData.prevX;
        node.y = e.eventData.prevY;
    }

    //Override - this = event
    applyRedo(e)
    {
        const graph = this.controller.getGraph();
        const node = graph.getNodeByElementID(e.eventData.nodeID);
        if (!node) throw new Error('Unable to find target in graph');
    
        node.x = e.eventData.nextX;
        node.y = e.eventData.nextY;
    }
}
export default GraphNodeMoveEventHandler;
