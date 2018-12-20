import QuadraticEdge from 'graph/QuadraticEdge.js';

class FSAEdge extends QuadraticEdge
{
  constructor(id, from, to=null)
  {
    super(id, from, to);
  }
}

export default FSAEdge;
