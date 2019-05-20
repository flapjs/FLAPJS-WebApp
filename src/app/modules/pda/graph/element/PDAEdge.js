import QuadraticEdge from 'graph2/element/QuadraticEdge.js';

export const LINE_SEPARATOR = '\n';
export const SYMBOL_SEPARATOR = ' ';
export const READ_SEPARATOR = ',';
export const POP_SEPARATOR = '\u2192';
export const EMPTY_CHAR = '\u03B5';

class PDAEdge extends QuadraticEdge
{
    constructor(id, from, to = null)
    {
        super(id, from, to);
    }

    /** @override */
    setEdgeLabel(label)
    {
        if (label)
        {
            super.setEdgeLabel(label);
        }
        else
        {
            super.setEdgeLabel(
                EMPTY_CHAR + READ_SEPARATOR +
                EMPTY_CHAR + POP_SEPARATOR +
                EMPTY_CHAR);
        }
    }
}

export default PDAEdge;
