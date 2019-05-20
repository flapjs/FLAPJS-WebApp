import EventHandler from './EventHandler.js';

class GraphEdgeDestinationEventHandler extends EventHandler
{
    constructor(eventLogger, graphController)
    {
        super(eventLogger, graphController, 'nodeInitial');
    }

    /** @override */
    captureEvent(graph, nextInitial, prevInitial)
    {
        return {
            graph: graph,
            nodeID: nextInitial.getGraphElementID(),
            prevID: prevInitial.getGraphElementID()
        };
    }

    //Override - this = event
    applyUndo(e)
    {
        const graph = this.controller.getGraph();
        const node = graph.getNodeByElementID(e.eventData.nodeID);
        if (!node) throw new Error('Unable to find target in graph');

        graph.setStartNode(node);
        this.controller.applyAutoRename();
    }

    //Override - this = event
    applyRedo(e)
    {
        const graph = this.controller.getGraph();
        const node = graph.getNodeByElementID(e.eventData.nodeID);
        if (!node) throw new Error('Unable to find target in graph');

        graph.setStartNode(node);
        this.controller.applyAutoRename();
    }
}
export default GraphEdgeDestinationEventHandler;
