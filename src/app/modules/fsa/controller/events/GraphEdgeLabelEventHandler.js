import EventHandler from './EventHandler.js';

class GraphEdgeLabelEventHandler extends EventHandler
{
    constructor(eventLogger, graphController)
    {
        super(eventLogger, graphController, 'edgeLabel');
    }

    /** @override */
    captureEvent(graph, targetEdge, nextLabel, prevLabel)
    {
        return {
            graph: graph,
            edgeID: targetEdge.getGraphElementID(),
            nextLabel: nextLabel,
            prevLabel: prevLabel
        };
    }

    /** @override */ - this = event
    applyUndo(e)
    {
        const graph = this.controller.getGraph();
        const edge = graph.getEdgeByElementID(e.eventData.edgeID);
        if (!edge) throw new Error('Unable to find target in graph');

        edge.setEdgeLabel(e.eventData.prevLabel);
    }

    /** @override */ - this = event
    applyRedo(e)
    {
        const graph = this.controller.getGraph();
        const edge = graph.getEdgeByElementID(e.eventData.edgeID);
        if (!edge) throw new Error('Unable to find target in graph');

        edge.setEdgeLabel(e.eventData.nextLabel);
    }
}
export default GraphEdgeLabelEventHandler;
