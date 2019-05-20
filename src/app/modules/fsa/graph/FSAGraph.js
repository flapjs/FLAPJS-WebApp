import NodeGraph from 'deprecated/graph/NodeGraph.js';
import FSANode from './FSANode.js';
import FSAEdge, { SYMBOL_SEPARATOR } from './FSAEdge.js';

const PARALLEL_EDGE_HEIGHT = 10;

class FSAGraph extends NodeGraph
{
    constructor()
    {
        super(FSANode, FSAEdge);

        this._nodes = [];
    }

    setStartNode(node)
    {
        if (this._nodes.length <= 0) throw new Error('Cannot set start node to empty graph');

        //There is only one node, and that is already the start node
        if (this._nodes.length === 1) return;

        const i = this._nodes.indexOf(node);
        if (i > 0)
        {
            //This does a swap; we could do a prepend but that's more costly...
            const prev = this._nodes[0];
            this._nodes[0] = node;
            this._nodes[i] = prev;
        }
        else if (i < 0)
        {
            throw new Error('Cannot set start node for unknown node');
        }
    }

    getStartNode()
    {
        return this._nodes.length > 0 ? this._nodes[0] : null;
    }

    /** @override */
    addNode(node)
    {
        this._nodes.push(node);
        return super.addNode(node);
    }

    /** @override */
    deleteNode(node)
    {
        super.deleteNode(node);
        const i = this._nodes.indexOf(node);
        if (i >= 0) this._nodes.splice(i, 1);
    }

    /** @override */
    clearNodes()
    {
        super.clearNodes();
        this._nodes.length = 0;
    }

    //This is more like addEdge() without adding it to the graph and just returns the result
    //This should only be called once when completing an edge
    /** @override */
    formatEdge(edge)
    {
        const edgeSource = edge.getEdgeFrom();
        const edgeDestination = edge.getEdgeTo();
        const edgeLabel = edge.getEdgeSymbolsFromLabel();

        //Look for an existing edge with similar from and to
        for (const otherEdge of this.getEdges())
        {
            if (otherEdge === edge) continue;
            if (otherEdge.getEdgeFrom() === edgeSource && otherEdge.getEdgeTo() === edgeDestination)
            {
                const otherSymbols = otherEdge.getEdgeSymbolsFromLabel();
                if (edgeLabel.length > 0)
                {
                    const result = otherSymbols.concat(edgeLabel);
                    otherEdge.setEdgeLabel(result.join(SYMBOL_SEPARATOR));
                }

                //Merged with newfound edge...
                return otherEdge;
            }
        }

        //Otherwise, format the current edge

        if (!edge.isSelfLoop())
        {
            let flag = false;

            //Bend away if there is another edge not bent with the same src/dst
            const parallelEdgeHeight = PARALLEL_EDGE_HEIGHT;
            const HALFPI = Math.PI / 2;
            for (const otherEdge of this.getEdges())
            {
                if (otherEdge.isQuadratic() && Math.abs(otherEdge.getQuadratic().length) >= parallelEdgeHeight * 2) continue;
                if ((otherEdge.getEdgeTo() === edgeSource && otherEdge.getEdgeFrom() === edgeDestination))
                {
                    edge.setQuadraticRadians(HALFPI).setQuadraticLength(parallelEdgeHeight);
                    otherEdge.setQuadraticRadians(HALFPI).setQuadraticLength(parallelEdgeHeight);
                    flag = true;

                    //ASSUMES that there will only ever be 2 edges that are parallel...
                    break;
                }
            }

            //Try to move the edge away from intersecting nodes...
            if (!flag)
            {
                const maxNodeSize = Math.max(edgeSource.getNodeSize(), edgeDestination.getNodeSize());
                const x1 = edgeSource.x;
                const y1 = edgeSource.y;
                const x2 = edgeDestination.x;
                const y2 = edgeDestination.y;
                const dist12sq = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
                let vertical = false;
                let m = 0;
                let b = 0;

                if (x1 > x2)
                {
                    m = (y1 - y2) / (x1 - x2);
                    b = y2 - m * x2;
                }
                else if (x1 < x2)
                {
                    m = (y2 - y1) / (x2 - x1);
                    b = y1 - m * x1;
                }
                else
                {
                    vertical = true;
                }

                for (const node of this.getNodes())
                {
                    if (node === edgeSource || node === edgeDestination) continue;

                    const x0 = node.x;
                    const y0 = node.y;

                    const dist01sq = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
                    const dist02sq = (x2 - x0) * (x2 - x0) + (y2 - y0) * (y2 - y0);
                    if (dist01sq > dist12sq || dist02sq > dist12sq) continue;

                    let dist = 0;
                    if (vertical)
                    {
                        dist = Math.abs(x1 - x0);
                    }
                    else
                    {
                        dist = Math.abs(b + m * x0 - y0) / Math.sqrt(1 + m * m);
                    }

                    if (dist < node.getNodeSize())
                    {
                        flag = true;
                        break;
                    }
                }

                if (flag)
                {
                    edge.setQuadraticRadians(-Math.PI / 2);
                    edge.setQuadraticLength(maxNodeSize + 10);
                }
            }
        }

        return edge;
    }
}

export default FSAGraph;
