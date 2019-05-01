import EventHandler from './EventHandler.js';

class UserToggleNodeEventHandler extends EventHandler
{
    constructor(eventLogger, graphController)
    {
        super(eventLogger, graphController, 'userToggleNode');
    }

    /** @override */
    captureEvent(graph, node, prevAccept)
    {
        return {
            nodeID: node.getGraphElementID(),
            prevAccept: prevAccept
        };
    }

    /** @override */ - this = event
    applyUndo(e)
    {
        const graph = this.controller.getGraph();
        const node = graph.getNodeByElementID(e.eventData.nodeID);
        if (!node) throw new Error('Unable to find target in graph');

        node.setNodeAccept(e.eventData.prevAccept);
    }

    /** @override */ - this = event
    applyRedo(e)
    {
        const graph = this.controller.getGraph();
        const node = graph.getNodeByElementID(e.eventData.nodeID);
        if (!node) throw new Error('Unable to find target in graph');

        node.setNodeAccept(!e.eventData.prevAccept);
    }
}
export default UserToggleNodeEventHandler;
