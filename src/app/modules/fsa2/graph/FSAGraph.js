import IndexedNodeGraph from 'graph2/IndexedNodeGraph.js';

import FSANode from './element/FSANode.js';
import FSAEdge from './element/FSAEdge.js';

class FSAGraph extends IndexedNodeGraph
{
    constructor()
    {
        super(FSANode, FSAEdge);
    }
}

export default FSAGraph;
