import AbstractGraphElement from './AbstractGraphElement.js';

/**
 * A class that represents the edge elements of a graph.
 * 
 * @see {@link NodeGraph}
 * @extends AbstractGraphElement
 */
class GraphEdge extends AbstractGraphElement
{
    /**
     * Creates a edge with the unique id.
     * 
     * @param {string} id           The element id for this node.
     * @param {GraphNode} from      The from node of the edge.
     * @param {GraphNode} [to=null] The to node of the edge.
     */
    constructor(id, from, to = null)
    {
        super(id);

        this._from = from;
        this._to = to;

        this._label = '';
    }

    setEdgeFrom(node)
    {
        if (!node) throw new Error('Source of edge cannot be null');

        this._from = node;
        return this;
    }

    setEdgeTo(node)
    {
        this._to = node;
        return this;
    }

    /**
     * Sets the edge label to the passed-in string.
     *
     * Assumes the label is NOT null.
     * 
     * @param {string} label The new edge label.
     * @returns {GraphEdge} This.
     */
    setEdgeLabel(label)
    {
        this._label = label;
        return this;
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

    getPlaceholderLength() { return this._from.getNodeSize(); }
    isPlaceholder() { return this._to === null; }
    isSelfLoop() { return this._from === this._to; }

    /**
     * Gets the label of the edge. If the edge has no label, it will return an
     * empty string.
     * 
     * @returns {string} The edge's label.
     */
    getEdgeLabel() { return this._label; }

    getEdgeFrom() { return this._from; }
    getEdgeTo() { return this._to; }

    /** @override */
    getHashString(usePosition = true)
    {
        const src = this._from ? this._from.getHashString(usePosition) : '';
        // HACK: to may be a pointer, which is not a node, so getHashString does not exist.
        const dst = this._to ? this._to.getHashString ? this._to.getHashString(usePosition) : '0' : '';
        return super.getHashString(usePosition) + ':' + src + ',' + dst + '.' + this._label;
    }
}

export default GraphEdge;
