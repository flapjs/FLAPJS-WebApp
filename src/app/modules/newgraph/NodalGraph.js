import { guid } from 'util/MathHelper.js';

import GraphBase, { NodeBase, EdgeBase } from './GraphBase.js';

class Node extends NodeBase
{
  constructor(x, y, id)
  {
    super(x, y, id);

    this.accept = false;
  }
}

class Edge extends EdgeBase
{
  constructor(from, to, id)
  {
    super(from, to, id);

    this._quad = {
      //Angle in radians where 0 is the normal of the midpoint
      radians: 0,
      //Distance from the midpoint
      length: 0,
      //Whether should be altered by formatting
      fixed: false
    };
  }

  getQuadratic()
  {
    return this._quad;
  }
}

class NodalGraph extends GraphBase
{
  constructor()
  {
    super([], []);
  }

  newNode(x=0, y=0)
  {
    const result = new Node(x, y, guid());
    this._nodes.push(result);
    return result;
  }

  newEdge(from, to=null)
  {
    const result = new Edge(from, to, guid());
    this._edges.push(result);
    return result;
  }
}

export default NodalGraph;
