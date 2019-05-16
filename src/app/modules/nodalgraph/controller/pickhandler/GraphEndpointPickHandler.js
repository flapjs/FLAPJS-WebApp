import PickHandler from './PickHandler.js';

const ENDPOINT_RADIUS = 6;
const ENDPOINT_RADIUS_SQU = ENDPOINT_RADIUS * ENDPOINT_RADIUS;

class GraphEndpointPickHandler extends PickHandler
{
    constructor()
    {
        super();
    }

    /** @override */
    getTargetAt(graph, x, y)
    {
        const end = {x: 0, y: 0};
        //Search graph
        for(const edge of graph.getEdges())
        {
            edge.getEndPoint(end);
            const dx = x - end.x;
            const dy = y - end.y;
            if (dx * dx + dy * dy < ENDPOINT_RADIUS_SQU)
            {
                return edge;
            }
        }
        return null;
    }

    /** @override */
    getTargetType() { return 'endpoint'; }
}

export default GraphEndpointPickHandler;
