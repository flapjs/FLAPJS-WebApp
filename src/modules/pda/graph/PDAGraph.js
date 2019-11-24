import IndexedNodeGraph from '@flapjs/services/graph/model/IndexedNodeGraph.js';

import PDANode from './element/PDANode.js';
import PDAEdge from './element/PDAEdge.js';

class PDAGraph extends IndexedNodeGraph
{
    constructor()
    {
        super(PDANode, PDAEdge);
    }
}

export default PDAGraph;
