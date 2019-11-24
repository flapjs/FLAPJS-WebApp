import GraphNode from './elements/GraphNode.js';
import GraphEdge from './elements/GraphEdge.js';
import { uuid, stringHash } from '@flapjs/util/MathHelper.js';

/**
 * A class that represents a graph that coordinates nodes and edges.
 */
class NodeGraph
{
    /**
     * Create a NodeGraph with the respective node and edge classes.
     * 
     * @param {Class} [nodeClass=GraphNode] The class that represents a node.
     * @param {Class} [edgeClass=GraphEdge] The class that represents an edge.
     */
    constructor(nodeClass = GraphNode, edgeClass = GraphEdge)
    {
        this._nodeClass = nodeClass;
        this._edgeClass = edgeClass;

        this._nodeMapping = new Map();
        this._edgeMapping = new Map();
    }

    /**
     * Removes all nodes and edges from the graph.
     */
    clear()
    {
        this.clearEdges();
        this.clearNodes();
    }

    /**
     * Checks whether there exists any number of nodes or edges.
     * 
     * @returns {boolean} Whether the graph is empty.
     */
    isEmpty()
    {
        return this._nodeMapping.size <= 0 && this._edgeMapping.size <= 0;
    }

    /**
     * Computes the boundaries of the graph that surrounds all nodes and edges. If
     * the graph is empty, a rectangle at the origin of size 1 is returned.
     * 
     * @returns {object}    The object which represents the bounding rectangle. It has
     *                      the properties: minX, minY, maxX, maxY, width, height.
     */
    getBoundingRect()
    {
        if (this._nodeMapping.size <= 0) return {
            minX: 0,
            minY: 0,
            maxX: 1,
            maxY: 1,
            width: 1,
            height: 1
        };

        var minNX = Number.MAX_VALUE;
        var minNY = Number.MAX_VALUE;
        var maxNX = Number.MIN_VALUE;
        var maxNY = Number.MIN_VALUE;

        var maxNodeSize = 0;
        for (const node of this._nodeMapping.values())
        {
            const x = node.x;
            const y = node.y;
            const size = node.getNodeSize();
            if (size > maxNodeSize) maxNodeSize = size;

            minNX = Math.min(minNX, x);
            maxNX = Math.max(maxNX, x);

            minNY = Math.min(minNY, y);
            maxNY = Math.max(maxNY, y);
        }

        minNX -= maxNodeSize;
        minNY -= maxNodeSize;
        maxNX += maxNodeSize;
        maxNY += maxNodeSize;

        var minEX = Number.MAX_VALUE;
        var minEY = Number.MAX_VALUE;
        var maxEX = Number.MIN_VALUE;
        var maxEY = Number.MIN_VALUE;

        const startPoint = { x: 0, y: 0 };
        const endPoint = { x: 0, y: 0 };
        const centerPoint = { x: 0, y: 0 };
        for (const edge of this._edgeMapping.values())
        {
            //Will store into point objects...
            edge.getStartPoint(startPoint);
            edge.getEndPoint(endPoint);
            edge.getCenterPoint(centerPoint);

            const sx = startPoint.x;
            const sy = startPoint.y;
            const ex = endPoint.x;
            const ey = endPoint.y;
            const cx = centerPoint.x;
            const cy = centerPoint.y;

            minEX = Math.min(minEX, sx, ex, cx);
            maxEX = Math.max(maxEX, sx, ex, cx);

            minEY = Math.min(minEY, sy, ey, cy);
            maxEY = Math.max(maxEY, sy, ey, cy);
        }

        const result = {
            minX: Math.min(minNX, minEX),
            minY: Math.min(minNY, minEY),
            maxX: Math.max(maxNX, maxEX),
            maxY: Math.max(maxNY, maxEY),
            width: 0,
            height: 0
        };
        result.width = result.maxX - result.minX;
        result.height = result.maxY - result.minY;
        return result;
    }

    /**
     * Computes a unique and persistent hash code that describes the current
     * state.
     * 
     * @param  {boolean} [usePosition=true] Whether to consider the positioning as
     *                                      part of the graph's state.
     * @returns {number}                    The hash code.
     */
    getHashCode(usePosition = true)
    {
        let string = '';
        for (const node of this._nodeMapping.values())
        {
            string += node.getHashString(usePosition) + ',';
        }
        string += '|';
        for (const edge of this._edgeMapping.values())
        {
            string += edge.getHashString(usePosition) + ',';
        }
        return stringHash(string);
    }

    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= NODES

    /**
     * Create node for graph.
     * 
     * @param  {number} [x=0]       The initial x position.
     * @param  {number} [y=0]       The initial y position.
     * @param  {string} [id=null]   The new node id (will be generated if null).
     * @returns {GraphNdoe}         The new node.
     */
    createNode(x = 0, y = 0, id = null)
    {
        return this.addNode(new (this._nodeClass)(id || uuid(), x, y));
    }

    /**
     * Add existing node to the graph. Any edges connected to the node are NOT
     * deleted in the process (so pls delete them first).
     * 
     * @param {GraphNode} node The node to be added.
     * @returns {GraphNode} The node that was added to the graph.
     */
    addNode(node)
    {
        if (!node.getGraphElementID()) node.setGraphElementID(uuid());
        this._nodeMapping.set(node.getGraphElementID(), node);
        return node;
    }

    /**
     * Delete node from graph. Any edges whose source is the target node are also
     * deleted.
     * 
     * @param {GraphNode} node Target node to be deleted.
     */
    deleteNode(node)
    {
        const elementID = node.getGraphElementID();
        if (this._nodeMapping.has(elementID))
        {
            this._nodeMapping.delete(elementID);

            const nullSourceEdges = [];
            //Find connected edges without sources...
            for (const edge of this.getEdges())
            {
                if (edge.getEdgeFrom() === node)
                {
                    nullSourceEdges.push(edge);
                }
                else if (edge.getEdgeTo() === node)
                {
                    edge.setEdgeTo(null);
                }
            }
            //Delete sourceless edges...
            for (const edge of nullSourceEdges)
            {
                this.deleteEdge(edge);
            }
        }
    }

    clearNodes() { this._nodeMapping.clear(); }

    getNodeByElementID(elementID)
    {
        if (this._nodeMapping.has(elementID))
        {
            return this._nodeMapping.get(elementID);
        }
        else
        {
            return null;
        }
    }

    getNodesByLabel(label, dst = [])
    {
        for (const node of this.getNodes())
        {
            if (node.getNodeLabel() === label)
            {
                dst.push(node);
            }
        }
        return dst;
    }

    getNodes() { return Array.from(this._nodeMapping.values()); }
    getNodeCount() { return this._nodeMapping.size; }
    getNodeClass() { return this._nodeClass; }

    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= EDGES

    /**
     * This is more like addEdge() without adding it to the graph and just returns the result.
     * This should only be called once when completing an edge.
     * 
     * @deprecated
     * @param {GraphEdge} edge The edge to format.
     * @returns {GraphEdge} The formatted edge.
     */
    formatEdge(edge)
    {
        return edge;
    }

    /**
     * Create edge for graph. The id argument can be used to set the id to a
     * pre-defined value instead of generating a new one.
     * 
     * @param {GraphNode} from                      The source graph node for the edge.
     * @param {GraphNode|InputPointer} [to=null]    The destination graph node for the edge.
     * @param {string} [id=null]                    The new edge id (will be generated if null).
     * @returns {GraphEdge}                         The new edge.
     */
    createEdge(from, to = null, id = null)
    {
        return this.addEdge(new (this._edgeClass)(id || uuid(), from, to));
    }

    /**
     * Add existing edge to the graph.
     * 
     * Assumes that the passed-in edge does not have conflicting id's within this graph.
     * 
     * @param {GraphEdge} edge    The edge to be added.
     * @returns {GraphEdge}       The edge that was added to the graph.
     */
    addEdge(edge)
    {
        if (!edge.getGraphElementID()) edge.setGraphElementID(uuid());
        this._edgeMapping.set(edge.getGraphElementID(), edge);
        return edge;
    }

    /**
     * Delete edge from graph. The from and to nodes of the target edge are not
     * modified.
     * 
     * @param {GraphEdge} edge Target edge to be deleted.
     */
    deleteEdge(edge)
    {
        const elementID = edge.getGraphElementID();
        if (this._edgeMapping.has(elementID))
        {
            this._edgeMapping.delete(elementID);
        }
    }

    clearEdges() { this._edgeMapping.clear(); }

    getEdgeByElementID(elementID)
    {
        if (this._edgeMapping.has(elementID))
        {
            return this._edgeMapping.get(elementID);
        }
        else
        {
            return null;
        }
    }

    getEdgesByLabel(label, dst = [])
    {
        for (const edge of this.getEdges())
        {
            if (edge.getEdgeLabel() === label)
            {
                dst.push(edge);
            }
        }
        return dst;
    }

    getEdges() { return Array.from(this._edgeMapping.values()); }
    getEdgeCount() { return this._edgeMapping.size; }
    getEdgeClass() { return this._edgeClass; }
}

export default NodeGraph;
