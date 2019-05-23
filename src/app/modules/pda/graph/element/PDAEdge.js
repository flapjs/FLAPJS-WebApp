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
    
    getEdgeSymbolsFromLine(line)
    {
        line = line.trim();
        let readIndex = line.indexOf(READ_SEPARATOR);
        let popIndex = line.indexOf(POP_SEPARATOR);

        if (readIndex <= 0) return [EMPTY_CHAR, EMPTY_CHAR, EMPTY_CHAR];
        let readSymbol = line.substring(0, readIndex);
        if (popIndex <= 0) return [readSymbol, EMPTY_CHAR, EMPTY_CHAR];
        let popSymbol = line.substring(readIndex + 1, popIndex);
        let pushSymbol = line.substring(popIndex + 1);
        if (pushSymbol.length <= 0) return [readSymbol, popSymbol, EMPTY_CHAR];

        return [readSymbol, popSymbol, pushSymbol];
    }
}

export default PDAEdge;
