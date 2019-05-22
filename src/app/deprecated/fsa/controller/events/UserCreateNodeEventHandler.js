import EventHandler from './EventHandler.js';

class UserCreateNodeEventHandler extends EventHandler
{
    constructor(eventLogger, graphController)
    {
        super(eventLogger, graphController, 'userPostCreateNode');
    }

    /** @override */
    captureEvent(graph, node)
    {
        return {
            nodeID: node.getGraphElementID(),
            x: node.x,
            y: node.y,
            accept: node.getNodeAccept(),
            label: node.getNodeLabel(),
            custom: node.getNodeCustom()
        };
    }

    //Override - this = event
    applyUndo(e)
    {
        const graph = this.controller.getGraph();
        const node = graph.getNodeByElementID(e.eventData.nodeID);
        if (!node) throw new Error('Unable to find target in graph');

        graph.deleteNode(node);
    }

    //Override - this = event
    applyRedo(e)
    {
        const graph = this.controller.getGraph();
        let node = graph.getNodeByElementID(e.eventData.nodeID);
        if (!node)
        {
            node = graph.createNode(e.postData.x, e.postData.y, e.postData.nodeID);
        }
        else
        {
            node.x = e.postData.x;
            node.y = e.postData.y;
        }
        node.setNodeLabel(e.postData.label);
        node.setNodeAccept(e.postData.accept);
        node.setNodeCustom(e.postData.custom);
    }
}
export default UserCreateNodeEventHandler;
