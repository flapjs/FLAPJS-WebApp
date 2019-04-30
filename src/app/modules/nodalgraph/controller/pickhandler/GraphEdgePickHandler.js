import PickHandler from './PickHandler.js';

const EDGE_RADIUS = 12;
const EDGE_RADIUS_SQU = EDGE_RADIUS * EDGE_RADIUS;

class GraphEdgePickHandler extends PickHandler
{
  constructor()
  {
    super();
  }

  //Override
  getTargetAt(graph, x, y)
  {
    const center = {x: 0, y: 0};

    //Search graph
    for(const edge of graph.getEdges())
    {
      edge.getCenterPoint(center);
      const dx = x - center.x;
      const dy = y - center.y;
      if (dx * dx + dy * dy < EDGE_RADIUS_SQU)
      {
        return edge;
      }
    }
    return null;
  }

  //Override
  getTargetType() { return "edge"; }
}

export default GraphEdgePickHandler;
