import IndexedNodeGraph from '@flapjs/systems/graph/model/IndexedNodeGraph.js';

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
