import PickHandler from './PickHandler.js';

const EDGE_RADIUS = 12;
const EDGE_RADIUS_SQU = EDGE_RADIUS * EDGE_RADIUS;

class GraphInitialPickHandler extends PickHandler
{
  constructor()
  {
    super();
  }

  //Override
  getTargetAt(graph, x, y)
  {
    const startNode = graph.getStartNode();
    if (!startNode) return null;

    const nodeSize = startNode.getNodeSize();
    const offset = -(nodeSize + (nodeSize / 2));
    const dx = x - (startNode.x + offset);
    const dy = y - startNode.y;
    if (dx * dx + dy * dy < EDGE_RADIUS_SQU)
    {
      return startNode;
    }

    return null;
  }

  //Override
  getTargetType() { return "initial"; }
}

export default GraphInitialPickHandler;
