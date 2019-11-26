import { SYMBOL_SEPARATOR } from '../elements/FSAEdge.js';

const PARALLEL_EDGE_HEIGHT = 10;

//This is more like addEdge() without adding it to the graph and just returns the result
//This should only be called once when completing an edge
export function applyLayout(edge)
{
    const edgeSource = edge.getEdgeFrom();
    const edgeDestination = edge.getEdgeTo();
    const edgeLabel = edge.getEdgeLabel().split(SYMBOL_SEPARATOR);

    //Look for an existing edge with similar from and to
    for(const otherEdge of this.getEdges())
    {
        if (otherEdge === edge) continue;
        if (otherEdge.getEdgeFrom() === edgeSource && otherEdge.getEdgeTo() === edgeDestination)
        {
            const otherLines = otherEdge.getEdgeLabel().split(SYMBOL_SEPARATOR);
            if (edgeLabel.length > 0)
            {
                const result = otherLines.concat(edgeLabel);
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
        for(const otherEdge of this.getEdges())
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

            if(x1 > x2)
            {
                m = (y1-y2) / (x1-x2);
                b = y2-m*x2;
            }
            else if (x1 < x2)
            {
                m = (y2-y1) / (x2-x1);
                b = y1-m*x1;
            }
            else
            {
                vertical = true;
            }

            for(const node of this._nodes)
            {
                if(node === edgeSource || node === edgeDestination) continue;

                const x0 = node.x;
                const y0 = node.y;

                const dist01sq = (x1-x0)*(x1-x0) + (y1-y0)*(y1-y0);
                const dist02sq = (x2-x0)*(x2-x0) + (y2-y0)*(y2-y0);
                if(dist01sq > dist12sq || dist02sq > dist12sq) continue;

                let dist = 0;
                if(vertical) 
                {
                    dist = Math.abs(x1-x0);
                }
                else 
                {
                    dist = Math.abs(b+ m*x0 - y0) / Math.sqrt(1+m*m);
                }

                if(dist < node.getNodeSize())
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
}
