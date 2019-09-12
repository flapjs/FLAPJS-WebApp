import AbstractGraphLabeler from 'graph2/AbstractGraphLabeler.js';

import { SYMBOL_SEPARATOR, EMPTY_CHAR } from 'modules/fsa2/graph/element/FSAEdge.js';

const DEFAULT_NODE_LABEL_PREFIX = 'q';

class FSAGraphLabeler extends AbstractGraphLabeler
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

function edgeLabelFormatter(string, allowNull = false)
{
    const symbols = string.split(SYMBOL_SEPARATOR);
    const result = new Set();

    let symbol = '';
    let symbolLength = 0;
    const length = symbols.length;
    for (let i = 0; i < length; ++i)
    {
        symbol = symbols[i].trim();
        symbolLength = symbol.length;
        //If the symbol has none or more than 1 char
        if (symbolLength !== 1)
        {
            //Remove symbol (by not adding to result)

            //Divide multi-char symbol into smaller single char symbols
            if (symbolLength > 1)
            {
                for (let subsymbol of symbol.split(''))
                {
                    subsymbol = subsymbol.trim();
                    if (!result.has(subsymbol))
                    {
                        result.add(subsymbol);
                    }
                }
            }
        }
        else
        {
            result.add(symbol);
        }
    }

    //If it is an empty string...
    if (result.size <= 0) return allowNull ? null : EMPTY_CHAR;
    return Array.from(result).join(SYMBOL_SEPARATOR);
}

export default FSAGraphLabeler;
