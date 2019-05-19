import OrderedNodeGraph from 'graph2/OrderedNodeGraph.js';

import FSANode from './element/FSANode.js';
import FSAEdge from './element/FSAEdge.js';

class FSAGraph extends OrderedNodeGraph
{
    constructor()
    {
        super(FSANode, FSAEdge);
    }
}

export default FSAGraph;
