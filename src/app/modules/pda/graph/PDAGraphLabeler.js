import AbstractGraphLabeler from 'graph2/AbstractGraphLabeler.js';

import
{
    EMPTY_CHAR,
    LINE_SEPARATOR,
    SYMBOL_SEPARATOR,
    READ_SEPARATOR,
    POP_SEPARATOR
} from './element/PDAEdge.js';

const DEFAULT_NODE_LABEL_PREFIX = 'q';

class PDAGraphLabeler extends AbstractGraphLabeler
{
    constructor()
    {
        super();

        this._prefix = DEFAULT_NODE_LABEL_PREFIX;
        this._graphController = null;
    }

    setGraphController(graphController)
    {
        this._graphController = graphController;
        return this;
    }

    setDefaultNodeLabelPrefix(prefix)
    {
        this._prefix = prefix;
    }

    getDefaultNodeLabelPrefix()
    {
        return this._prefix;
    }

    /** @override */
    getDefaultNodeLabel()
    {
        if (!this._graphController.shouldAutoRenameNodes())
        {
            return this.getDefaultNodeLabelPrefix();
        }
        else
        {
            const graph = this._graphController.getGraph();
            const otherNodes = [];
            let nodeIndex = 0;

            const startNode = graph.getStartNode();
            if (startNode && startNode.getNodeCustom()) nodeIndex = 1;

            let newNodeLabel = this.getDefaultNodeLabelPrefix() + nodeIndex;
            while (graph.getNodesByLabel(newNodeLabel, otherNodes).length > 0)
            {
                otherNodes.length = 0;
                ++nodeIndex;
                newNodeLabel = this.getDefaultNodeLabelPrefix() + nodeIndex;
            }

            return newNodeLabel;
        }
    }

    /** @override */
    getDefaultEdgeLabel()
    {
        return '';
    }

    /** @override */
    getNodeLabelFormatter()
    {
        return (string) => string || '';
    }

    /** @override */
    getEdgeLabelFormatter()
    {
        return edgeLabelFormatter;
    }
}

function isValidSymbol(symbol)
{
    return symbol.length === 1 &&
        symbol !== LINE_SEPARATOR &&
        symbol !== SYMBOL_SEPARATOR &&
        symbol !== READ_SEPARATOR &&
        symbol !== POP_SEPARATOR;
}

function edgeLabelFormatter(string, allowNull = false)
{
    const lines = string.split(LINE_SEPARATOR);
    const result = new Set();
    const length = lines.length;

    let symbols;
    let symbolLength = 0;
    for (let i = 0; i < length; ++i)
    {
        symbols = lines[i].trim().split('');
        symbolLength = symbols.length;

        if (symbolLength <= 0)
        {
            result.add('');
            continue;
        }

        let readSymbol = null;
        let popSymbol = null;
        let pushSymbol = null;
        let symbol = null;

        for (let j = 0; j < symbolLength; ++j)
        {
            if (readSymbol === null)
            {
                symbol = symbols[j].trim();
                if (isValidSymbol(symbol))
                {
                    readSymbol = symbol;
                    if (j + 1 < symbolLength && (symbols[j + 1] === READ_SEPARATOR || symbols[j + 1] === SYMBOL_SEPARATOR))
                    {
                        ++j;
                    }
                }
            }
            else if (popSymbol === null)
            {
                symbol = symbols[j].trim();
                if (isValidSymbol(symbol))
                {
                    popSymbol = symbol;
                    if (j + 1 < symbolLength && (symbols[j + 1] === POP_SEPARATOR || symbols[j + 1] === SYMBOL_SEPARATOR))
                    {
                        ++j;
                    }
                }
            }
            else if (pushSymbol === null)
            {
                symbol = symbols[j].trim();
                if (isValidSymbol(symbol))
                {
                    pushSymbol = symbol;
                    break;
                }
            }
        }

        if (readSymbol === null)
        {
            result.add('');
        }
        else if (popSymbol === null)
        {
            result.add(readSymbol + READ_SEPARATOR);
        }
        else if (pushSymbol === null)
        {
            result.add(readSymbol + READ_SEPARATOR + popSymbol + POP_SEPARATOR);
        }
        else
        {
            result.add(readSymbol + READ_SEPARATOR + popSymbol + POP_SEPARATOR + pushSymbol);
        }
    }

    //If it is an empty string...
    if (result.size <= 0) return allowNull ? null : EMPTY_CHAR;
    return Array.from(result).join(LINE_SEPARATOR);
}

export default PDAGraphLabeler;
