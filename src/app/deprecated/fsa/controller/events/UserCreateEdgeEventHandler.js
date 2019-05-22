import EventHandler from './EventHandler.js';

class UserCreateEdgeEventHandler extends EventHandler
{
    constructor(eventLogger, graphController)
    {
        super(eventLogger, graphController, 'userPostCreateEdge');
    }

    /** @override */
    captureEvent(graph, edge)
    {
        const edgeQuad = edge.getQuadratic();
        return {
            edge: edge,
            edgeID: edge.getGraphElementID(),
            fromID: edge.getEdgeFrom().getGraphElementID(),
            toID: edge.getEdgeTo() ? edge.getEdgeTo().getGraphElementID() : null,
            label: edge.getEdgeLabel(),
            quad: { radians: edgeQuad.radians, length: edgeQuad.length }
        };
    }

    //Override - this = event
    applyUndo(e)
    {
    //TODO: when formatting edges change an edge different than this one, it does not revert them.
        const graph = this.controller.getGraph();
        const edge = graph.getEdgeByElementID(e.eventData.edgeID);
        if (!edge) throw new Error('Unable to find target in graph');

        graph.deleteEdge(edge);
    }

    //Override - this = event
    applyRedo(e)
    {
        const graph = this.controller.getGraph();
        let edge = graph.getEdgeByElementID(e.postData.edgeID);

        const from = graph.getNodeByElementID(e.postData.fromID);
        if (!from) throw new Error('Trying to create a sourceless edge');
        const to = graph.getNodeByElementID(e.postData.toID) || null;

        if (!edge)
        {
            edge = graph.createEdge(from, to, e.postData.edgeID);
        }
        else
        {
            edge.setEdgeFrom(from);
            edge.changeDestinationNode(to);
        }

        edge.setEdgeLabel(e.postData.label);
        edge.setQuadraticRadians(e.postData.quad.radians);
        edge.setQuadraticLength(e.postData.quad.length);
    }
}
export default UserCreateEdgeEventHandler;
