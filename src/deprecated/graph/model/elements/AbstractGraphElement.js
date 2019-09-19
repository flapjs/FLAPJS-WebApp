/**
 * A class that represents any positioned, unique object in a graph. Usually
 * this is not instantiated, but rather extended. Look at {@link GraphNode}
 * and {@link GraphEdge} as examples.
 */
class AbstractGraphElement
{
    /**
     * Creates an element with the unique id.
     * 
     * @param {number} elementID The unique id that represents the element.
     */
    constructor(elementID)
    {
        this._id = elementID;
    }

    /**
     * Sets the element's id to the passed-in id.
     *
     * @param {string} elementID  The new id.
     * @returns {this}
     */
    setGraphElementID(elementID)
    {
        this._id = elementID;
        return this;
    }

    /**
     * Compute the center point of the element and store the result in dst. The
     * properties changed in dst are: x, y.
     *
     * @param  {object} [dst={x: 0, y: 0}]    The object to store the result.
     * @returns {object}                       The passed-in dst.
     */
    getCenterPoint(dst = { x: 0, y: 0 })
    {
        dst.x = dst.y = 0;
        return dst;
    }

    /**
     * A unique identifier for this graph element.
     *
     * @returns {string} The unique identifier for this element.
     */
    getGraphElementID() { return this._id; }

    /**
     * Computes the hash string that represents this element and its current state
     * uniquely and deterministically. {@link NodeGraph} Uses this to compute its
     * hash code that distinguishes it from other graphs. The generated string
     * should only be used to differentiate between other objects of the same hash
     * function. In other words, every instance should only be compared to other
     * instances of the same class (or extended class without override).
     *
     * @param  {boolean} [usePosition=true] Whether to consider positioning as
     *                                      part of the unique state.
     * @returns {string}                     The hash string that represents this
     *                                      current state.
     */
    getHashString(usePosition = true) { return this._id; }
}

export default AbstractGraphElement;
