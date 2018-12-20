import NodalGraph from 'graph/NodalGraph.js';
import FSANode from './FSANode.js';
import FSAEdge from './FSAEdge.js';
import { guid } from 'util/MathHelper.js';

class FSAGraph extends NodalGraph
{
  constructor()
  {
    super();
  }

  //Override
  createNode(x=0, y=0, id=guid())
  {
    const result = new FSANode(id, x, y);
    this._nodes.push(result);
    return result;
  }

  //Override
  createEdge(from, to=null, id=guid())
  {
    const result = new FSAEdge(id, from, to);
    this._edges.push(result);
    return result;
  }
}

export default FSAGraph;
