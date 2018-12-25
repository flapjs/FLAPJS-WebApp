import QuadraticEdge from 'graph/QuadraticEdge.js';

export const SYMBOL_SEPARATOR = ' ';
export const EMPTY_CHAR = '\u03B5';

class FSAEdge extends QuadraticEdge
{
  constructor(id, from, to=null)
  {
    super(id, from, to);
  }

  getEdgeSymbolsFromLabel()
  {
    return this.getEdgeLabel().split(SYMBOL_SEPARATOR);
  }
}

export default FSAEdge;
