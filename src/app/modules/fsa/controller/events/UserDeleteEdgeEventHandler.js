import EventHandler from './EventHandler.js';

class UserDeleteEdgeEventHandler extends EventHandler
{
    constructor(eventLogger, graphController)
    {
        super(eventLogger, graphController, 'userPreDeleteEdge');
    }

    /** @override */
    captureEvent(graph, edge, prevTo, prevQuad)
    {
        return {
            edge: edge,
            edgeID: edge.getGraphElementID(),
            fromID: edge.getSourceNode().getGraphElementID(),
            toID: prevTo ? prevTo.getGraphElementID() : null,
            label: edge.getEdgeLabel(),
            quad: Object.assign({}, prevQuad)
        };
    }

    /** @override */ - this = event
    applyUndo(e)
    {
        const graph = this.controller.getGraph();
        let edge = graph.getEdgeByElementID(e.eventData.edgeID);

        const from = graph.getNodeByElementID(e.eventData.fromID);
        if (!from) throw new Error('Trying to create a sourceless edge');
        const to = graph.getNodeByElementID(e.eventData.toID) || null;

        if (!edge)
        {
            edge = graph.createEdge(from, to, e.eventData.edgeID);
        }
        else
        {
            edge.setSourceNode(from);
            edge.changeDestinationNode(to);
        }

        edge.setEdgeLabel(e.eventData.label);
        edge.setQuadratic(e.eventData.quad.radians, e.eventData.quad.length);
    }

    /** @override */ - this = event
    applyRedo(e)
    {
        const graph = this.controller.getGraph();
        const edge = graph.getEdgeByElementID(e.eventData.edgeID);
        if (!edge) throw new Error('Unable to find target in graph');

        graph.deleteEdge(edge);
    }
}
export default UserDeleteEdgeEventHandler;
