import EventHandler from './EventHandler.js';

class UserRenameNodeEventHandler extends EventHandler
{
    constructor(eventLogger, graphController)
    {
        super(eventLogger, graphController, 'userRenameNode');
    }

    /** @override */
    captureEvent(graph, node, nextLabel, prevLabel, isPrevCustom)
    {
        return {
            node: node,
            nodeID: node.getGraphElementID(),
            nextLabel: nextLabel,
            prevLabel: prevLabel,
            prevCustom: isPrevCustom
        };
    }

    //Override - this = event
    applyUndo(e)
    {
        const graph = this.controller.getGraph();
        const node = graph.getNodeByElementID(e.eventData.nodeID);
        if (!node) throw new Error('Unable to find target in graph');

        node.setNodeLabel(e.eventData.prevLabel);
        node.setNodeCustom(e.eventData.prevCustom);
    }

    //Override - this = event
    applyRedo(e)
    {
        const graph = this.controller.getGraph();
        const node = graph.getNodeByElementID(e.eventData.nodeID);
        if (!node) throw new Error('Unable to find target in graph');

        node.setNodeLabel(e.eventData.nextLabel);
        node.setNodeCustom(true);
    }
}
export default UserRenameNodeEventHandler;
