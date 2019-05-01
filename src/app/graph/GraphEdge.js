import GraphElement from 'graph/GraphElement.js';

class GraphEdge extends GraphElement
{
    constructor(id, from, to = null)
    {
        super(id);

        if (!from) throw new Error('Source of edge cannot be null.');

        this._from = from;
        this._to = to;

        this._label = '';
    }

    setSourceNode(node)
    {
        if (!node) throw new Error('Source of edge cannot be null.');

        this._from = node;
        return this;
    }

    getSourceNode()
    {
        return this._from;
    }

    setDestinationNode(node)
    {
        this._to = node;
        return this;
    }

    changeDestinationNode(node)
    {
        this._to = node;
    }

    getDestinationNode()
    {
        return this._to;
    }

    setEdgeLabel(label)
    {
        this._label = label;
    }

    getEdgeLabel()
    {
        return this._label;
    }

    getEdgeDirection()
    {
        const from = this._from;
        const to = this._to;
        const HALFPI = Math.PI / 2;
        let result = 0;

        if (this.isPlaceholder())
        {
            result = Math.PI / 4;
        }
        else
        {
            const dy = to.y - from.y;
            const dx = to.x - from.x;
            result = Math.atan2(dy, dx);
        }

        if (result > HALFPI || result < -HALFPI)
        {
            result += Math.PI;
        }

        return result;
    }

    getStartPoint(dst = { x: 0, y: 0 })
    {
        const from = this._from;
        dst.x = from.x;
        dst.y = from.y;
        return dst;
    }

    /** @override */
    getCenterPoint(dst = { x: 0, y: 0 })
    {
        const from = this._from;
        const to = this._to;
        if (this.isPlaceholder())
        {
            const halfPlaceholderLength = this.getPlaceholderLength() / 2;
            dst.x = from.x + halfPlaceholderLength;
            dst.y = from.y + halfPlaceholderLength;
        }
        else
        {
            dst.x = from.x + (to.x - from.x) / 2;
            dst.y = from.y + (to.y - from.y) / 2;
        }
        return dst;
    }

    getEndPoint(dst = { x: 0, y: 0 })
    {
        if (this.isPlaceholder())
        {
            const from = this._from;
            const placeholderLength = this.getPlaceholderLength();
            dst.x = from.x + placeholderLength;
            dst.y = from.y + placeholderLength;
        }
        else
        {
            const to = this._to;
            dst.x = to.x;
            dst.y = to.y;
        }
        return dst;
    }

    getPlaceholderLength()
    {
        return this._from.getNodeSize();
    }

    isPlaceholder()
    {
        return !this._to;
    }

    isSelfLoop()
    {
        return this._from === this._to;
    }

    /** @override */
    getHashString(usePosition = true)
    {
        const src = this._from ? this._from.getHashString(usePosition) : '';
        //HACK: to may be a pointer, which is not a node, so getHashString does not exist.
        const dst = this._to ? this._to.getHashString ? this._to.getHashString(usePosition) : '0' : '';
        return super.getHashString(usePosition) + ':' + src + ',' + dst + '.' + this._label;
    }
}

export default GraphEdge;
