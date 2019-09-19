import NodeGraph from './NodeGraph.js';

/**
 * A class that represents a node graph with indexed and ordered node list.
 * This means that there exists a first node, which would be used for the
 * start node, if that semantically makes sense for your graph.
 */
class IndexedNodeGraph extends NodeGraph
{
    /**
     * Create an IndexedNodeGraph with the respective node and edge classes.
     * 
     * @param {Class} [nodeClass]
     * @param {Class} [edgeClass]
     */
    constructor(nodeClass, edgeClass)
    {
        super(nodeClass, edgeClass);

        this._nodes = [];
    }

    /**
     * Sets the first node, which is at index 0, to the passed-in node. The node must
     * already exist in the graph.
     *
     * @param {GraphNode} node The node to be first.
     */
    setStartNode(node)
    {
        if (this._nodes.length <= 0) throw new Error('Cannot set start node to empty graph');

        // There is only one node, and that is already the start node
        if (this._nodes.length === 1) return;

        const i = this._nodes.indexOf(node);
        if (i > 0)
        {
            // This does a swap; we could do a prepend but that's more costly...
            const prev = this._nodes[0];
            this._nodes[0] = node;
            this._nodes[i] = prev;
        }
        else if (i < 0)
        {
            throw new Error('Cannot set start node for unknown node');
        }
    }

    /**
     * Gets the first node, which is at index 0, for the graph.
     */
    getStartNode() { return this._nodes.length > 0 ? this._nodes[0] : null; }

    /**
     * Gets the node by its index. The index must be between 0 and the node count.
     *
     * @param {number} index 
     */
    getNodeByIndex(index)
    {
        return this._nodes[index];
    }

    /** @override */
    addNode(node)
    {
        this._nodes.push(node);
        return super.addNode(node);
    }

    /** @override */
    deleteNode(node)
    {
        super.deleteNode(node);
        const i = this._nodes.indexOf(node);
        if (i >= 0) this._nodes.splice(i, 1);
    }

    /** @override */
    clearNodes()
    {
        super.clearNodes();
        this._nodes.length = 0;
    }

    /** @override */
    getNodes()
    {
        return this._nodes;
    }
}

export default IndexedNodeGraph;
