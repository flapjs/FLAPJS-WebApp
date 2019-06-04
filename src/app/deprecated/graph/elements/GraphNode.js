import GraphElement from './GraphElement.js';

/**
 * A class that represents the node elements of a graph.
 *
 * @see {@link NodeGraph}
 * @extends GraphElement
 */
class GraphNode extends GraphElement
{
    /**
   * Creates a node with the unique id.
   * 
   * @param {String} id     the element id for this node.
   * @param {Number} [x=0]  the initial x position
   * @param {Number} [y=0]  the initial y position
   */
    constructor(id, x = 0, y = 0)
    {
        super(id);

        this.x = x;
        this.y = y;

        this._label = '';
    }

    /** @override */
    getCenterPoint(dst={x: 0, y: 0})
    {
        dst.x = this.x;
        dst.y = this.y;
        return dst;
    }

    /**
   * Sets the node label to the passed-in string.
   *
   * Assumes the label is NOT null.
   * @param {String} label  The new node label.
   * @returns {this}
   */
    setNodeLabel(label)
    {
        this._label = label;
        return this;
    }

    /**
   * Gets the label of the node. If the node has no label, it will return an
   * empty string.
   * @returns {String} The node's label.
   */
    getNodeLabel() { return this._label; }

    /**
   * Gets the size of the node. Can be overriden to specify a different size.
   * @returns {Number} The radius of the node.
   */
    getNodeSize() { return 16; }

    /** @override */
    getHashString(usePosition=true)
    {
        if (usePosition)
        {
            return super.getHashString(usePosition) + ':' +
        Math.floor(this.x) + ',' + Math.floor(this.y) + '.' + this._label;
        }
        else
        {
            return super.getHashString(usePosition) + ':' + this._label;
        }
    }
}

export default GraphNode;
