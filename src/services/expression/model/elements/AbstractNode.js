/**
 * An Abstract Syntax Tree is used for parsing languages, in this case we use them
 * for parsing regular expressions.
 */
class AbstractNode
{
    constructor(symbol, index)
    {
        this._symbol = symbol;				// Character/String to represent symbol from language
        this._index = index;				// Index of the symbol in the original String we are parsing
        this._parent = null;
    }

    hasChildren() { return false; }
    getChildren() { return []; }

    setIndex(index)
    {
        this._index = index;
        return this;
    }

    setParent(parentNode)
    {
        this._parent = parentNode;
        return this;
    }

    setSymbol(newSymbol)
    {
        this._symbol = newSymbol;
        return this;
    }

    getSymbol() { return this._symbol; }
    getParent() { return this._parent; }
    getIndex() { return this._index; }
}

export default AbstractNode;
