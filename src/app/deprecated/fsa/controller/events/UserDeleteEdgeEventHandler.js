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
            fromID: edge.getEdgeFrom().getGraphElementID(),
            toID: prevTo ? prevTo.getGraphElementID() : null,
            label: edge.getEdgeLabel(),
            quad: Object.assign({}, prevQuad)
        };
    }

    //Override - this = event
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
            edge.setEdgeFrom(from);
            edge.changeDestinationNode(to);
        }

        edge.setEdgeLabel(e.eventData.label);
        edge.setQuadraticRadians(e.eventData.quad.radians);
        edge.setQuadraticLength(e.eventData.quad.length);
    }

    //Override - this = event
    applyRedo(e)
    {
        const graph = this.controller.getGraph();
        const edge = graph.getEdgeByElementID(e.eventData.edgeID);
        if (!edge) throw new Error('Unable to find target in graph');

        graph.deleteEdge(edge);
    }
}
export default UserDeleteEdgeEventHandler;
