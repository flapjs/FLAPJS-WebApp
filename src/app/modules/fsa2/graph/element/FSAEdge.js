import QuadraticEdge from 'graph2/element/QuadraticEdge.js';

export const SYMBOL_SEPARATOR = ' ';
export const EMPTY_CHAR = '\u03B5';

class FSAEdge extends QuadraticEdge
{
    constructor(id, from, to = null)
    {
        super(id, from, to);
    }

    /** @override */
    setEdgeLabel(label)
    {
        if (typeof label === 'string')
        {
            super.setEdgeLabel(label);
        }
        else
        {
            super.setEdgeLabel(EMPTY_CHAR);
        }
    }
}

export default FSAEdge;
