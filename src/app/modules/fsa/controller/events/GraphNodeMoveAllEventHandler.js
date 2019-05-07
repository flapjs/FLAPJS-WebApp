import EventHandler from './EventHandler.js';

class GraphNodeMoveAllEventHandler extends EventHandler
{
    constructor(eventLogger, graphController)
    {
        super(eventLogger, graphController, 'nodeMoveAll');
    }

    /** @override */
    captureEvent(graph, nodes, dx, dy)
    {
        return {
            graph: graph,
            nodeIDs: nodes.map(e => e.getGraphElementID()),
            dx: dx,
            dy: dy
        };
    }

    //Override - this = event
    applyUndo(e)
    {
        const graph = this.controller.getGraph();
        let node = null;
        for(const nodeID of e.eventData.nodeIDs)
        {
            node = graph.getNodeByElementID(nodeID);
            if (!node) throw new Error('Unable to find target in graph');

            node.x -= e.eventData.dx;
            node.y -= e.eventData.dy;
        }
    }

    //Override - this = event
    applyRedo(e)
    {
        const graph = this.controller.getGraph();
        let node = null;
        for(const nodeID of e.eventData.nodeIDs)
        {
            node = graph.getNodeByElementID(nodeID);
            if (!node) throw new Error('Unable to find target in graph');

            node.x += e.eventData.dx;
            node.y += e.eventData.dy;
        }
    }
}
export default GraphNodeMoveAllEventHandler;
