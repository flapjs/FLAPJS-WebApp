import NodeGraph from 'graph2/NodeGraph.js';

class IndexedNodeGraph extends NodeGraph
{
    constructor(nodeClass, edgeClass)
    {
        super(nodeClass, edgeClass);

        this._nodes = [];
    }

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

    getStartNode() { return this._nodes.length > 0 ? this._nodes[0] : null; }

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
