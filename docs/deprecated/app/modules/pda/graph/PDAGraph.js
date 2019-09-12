import IndexedNodeGraph from 'graph2/IndexedNodeGraph.js';

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
