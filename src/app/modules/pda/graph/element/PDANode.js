import GraphNode from 'graph2/element/GraphNode.js';

class PDANode extends GraphNode
{
    constructor(id, x, y)
    {
        super(id, x, y);

        this._accept = false;

        //this is not saved to hash since it is an aesthetic option
        this._custom = false;
    }

    setNodeAccept(value)
    {
        this._accept = value;
    }

    getNodeAccept()
    {
        return this._accept;
    }

    setNodeCustom(value)
    {
        this._custom = value;
    }

    getNodeCustom()
    {
        return this._custom;
    }

    /** @override */
    getHashString(usePosition = true)
    {
        return super.getHashString(usePosition) + ':' + (this._accept ? '1' : '0');
    }
}

export default PDANode;
