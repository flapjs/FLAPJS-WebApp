import AbstractGraphElement from './AbstractGraphElement.js';

/**
 * A class that represents the node elements of a graph.
 *
 * @see {@link NodeGraph}
 * @extends AbstractGraphElement
 */
class GraphNode extends AbstractGraphElement
{
    /**
     * Creates a node with the unique id.
     * 
     * @param {string} id         The element id for this node.
     * @param {number} [x=0]      The initial x position.
     * @param {number} [y=0]      The initial y position.
     */
    constructor(id, x = 0, y = 0)
    {
        super(id);

        this.x = x;
        this.y = y;
    
        this._label = '';
    }

    /** @override */
    getCenterPoint(dst = { x: 0, y: 0 })
    {
        dst.x = this.x;
        dst.y = this.y;
        return dst;
    }

    /**
     * Sets the node label to the passed-in string.
     *
     * Assumes the label is NOT null.
     * 
     * @param {string} label The new node label.
     * @returns {GraphNode} This.
     */
    setNodeLabel(label)
    {
        this._label = label;
        return this;
    }

    /**
     * Gets the label of the node. If the node has no label, it will return an
     * empty string.
     * 
     * @returns {string} The node's label.
     */
    getNodeLabel() { return this._label; }

    /**
     * Gets the size of the node. Can be overriden to specify a different size.
     * 
     * @returns {number} The radius of the node.
     */
    getNodeSize() { return 16; }

    /** @override */
    getHashString(usePosition=true)
    {
        if (usePosition)
        {
            return super.getHashString(usePosition)
                + ':' + Math.floor(this.x)
                + ',' + Math.floor(this.y)
                + '.' + this._label;
        }
        else
        {
            return super.getHashString(usePosition)
                + ':' + this._label;
        }
    }
}

export default GraphNode;
