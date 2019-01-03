import AbstractGraphController from 'modules/abstract/AbstractGraphController.js';

import NodalGraph from 'graph/NodalGraph.js';
import GraphNode from 'graph/GraphNode.js';
import QuadraticEdge from 'graph/QuadraticEdge.js';

class DefaultGraphController extends AbstractGraphController
{
  constructor(module)
  {
    super(module, new NodalGraph(GraphNode, QuadraticEdge));
  }
}
export default DefaultGraphController;
