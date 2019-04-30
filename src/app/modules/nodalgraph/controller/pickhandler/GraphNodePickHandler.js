import PickHandler from './PickHandler.js';

class GraphNodePickHandler extends PickHandler
{
  constructor()
  {
    super();
  }

  //Override
  getTargetAt(graph, x, y)
  {
    //Search graph
    for(const node of graph.getNodes())
    {
      const nodeSize = node.getNodeSize();
      const dx = x - node.x;
      const dy = y - node.y;
      if (dx * dx + dy * dy < nodeSize * nodeSize)
      {
        return node;
      }
    }
    return null;
  }

  //Override
  getTargetType() { return "node"; }
}

export default GraphNodePickHandler;
