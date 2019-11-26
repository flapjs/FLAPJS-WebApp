import AbstractParser from '@flapjs/util/loader/AbstractParser.js';
import SemanticVersion from '@flapjs/util/SemanticVersion.js';

import NodeGraph from '../NodeGraph.js';
import GraphNode from '../elements/GraphNode';
import GraphEdge from '../elements/GraphEdge.js';
import QuadraticEdge from '../elements/QuadraticEdge.js';

export const VERSION_STRING = '1.0.0';
export const VERSION = SemanticVersion.parse(VERSION_STRING);

/**
 * A class that parses and composes NodeGraph's to and from JSON data.
 */
class NodeGraphParser extends AbstractParser
{
    constructor()
    {
        super();

        this._nodeIndices = new Map();
    }

    /**
     * @override
     * @param  {object} data         	    The graph data to parse.
     * @param  {NodeGraph} [dst=null]		The target to set parsed graph data.
     * @returns {NodeGraph}                 The result in the passed-in dst.
     */
    parse(data, dst = null)
    {
        if (typeof data !== 'object')
        {
            throw new Error('Unable to parse data of non-object type');
        }

        const dataVersion = SemanticVersion.parse(data['_version'] || '0.0.0');
        if (!dataVersion.canSupportVersion(VERSION))
        {
            throw new Error('Unable to parse data for incompatible version \'' + dataVersion + '\'');
        }

        const nodeDatas = data['nodes'] || [];
        const nodeCount = Math.min(nodeDatas.length || 0, data['nodeCount'] || 0);
        const edgeDatas = data['edges'] || [];
        const edgeCount = Math.min(edgeDatas.length || 0, data['edgeCount'] || 0);

        dst = this.onParseGraphCreate(data, dst);

        const nodeIndices = this._nodeIndices;
        for (let i = 0; i < nodeCount; ++i)
        {
            const nodeData = nodeDatas[i];
            if (!nodeData) continue;

            // NOTE: Assumes createNode will maintain order (it will because JavaScript Map's maintain order)
            const node = dst.createNode(nodeData['x'] || 0, nodeData['y'] || 0, nodeData['id']);
            node.setNodeLabel(nodeData['label'] || '');

            this.onParseNode(nodeData, node);

            nodeIndices.set(i, node);
        }

        for (let i = 0; i < edgeCount; ++i)
        {
            const edgeData = edgeDatas[i];
            if (!edgeData) continue;
            const sourceNode = nodeIndices.get(edgeData['from']) || null;
            // Cannot create source-less edges
            if (!sourceNode) continue;
            const destinationNode = nodeIndices.get(edgeData['to']) || null;

            // NOTE: Assumes createEdge will maintain order (it will because JavaScript Map's maintain order)
            const edge = dst.createEdge(sourceNode, destinationNode, edgeData['id']);
            edge.setEdgeLabel(edgeData['label'] || '');

            this.onParseEdge(edgeData, edge);
        }

        this.onParseGraphResult(data, dst);

        // Clean-up
        nodeIndices.clear();

        return dst;
    }

    /**
     * @override
     * @param {NodeGraph} target    The graph to compose into data.
     * @param {object} [dst=null]   The object to append graph data.
     * @returns {object}            The result in the passed-in dst.
     */
    compose(target, dst = null)
    {
        if (!(target instanceof NodeGraph))
        {
            throw new Error('Unable to compose target of non-graph type');
        }

        dst = this.onComposeGraphCreate(target, dst);

        const graphNodes = target.getNodes() || [];
        const nodeCount = graphNodes.length || 0;
        const graphEdges = target.getEdges() || [];
        const edgeCount = graphEdges.length || 0;

        const nodeDatas = new Array(nodeCount);
        const nodeIndices = this._nodeIndices;
        let node;
        for (let i = 0; i < nodeCount; ++i)
        {
            node = graphNodes[i];
            if (node)
            {
                //NOTE: Assumes node must have an id
                const elementID = node.getGraphElementID();

                nodeIndices.set(node, i);

                const nodeData = {
                    id: elementID,
                    x: node.x || 0, y: node.y || 0,
                    label: node.getNodeLabel() || ''
                };

                this.onComposeNode(node, nodeData);

                nodeDatas[i] = nodeData;
            }
        }

        const edgeDatas = new Array(edgeCount);
        let edge;
        for (let i = 0; i < edgeCount; ++i)
        {
            edge = graphEdges[i];
            if (edge)
            {
                //NOTE: Assumes edge must have an id
                const elementID = edge.getGraphElementID();

                const edgeSource = edge.getEdgeFrom();
                const edgeDestination = edge.getEdgeTo();
                const sourceIndex = nodeIndices.has(edgeSource) ? nodeIndices.get(edgeSource) : -1;
                const destinationIndex = nodeIndices.has(edgeDestination) ? nodeIndices.get(edgeDestination) : -1;
                const edgeData = {
                    id: elementID,
                    from: sourceIndex,
                    to: destinationIndex,
                    label: edge.getEdgeLabel() || ''
                };

                this.onComposeEdge(edge, edgeData);

                edgeDatas[i] = edgeData;
            }
        }

        dst['_version'] = VERSION_STRING;
        dst['nodeCount'] = nodeCount;
        dst['nodes'] = nodeDatas;
        dst['edgeCount'] = edgeCount;
        dst['edges'] = edgeDatas;

        this.onComposeGraphResult(target, dst);

        // Clean-up
        nodeIndices.clear();

        return dst;
    }

    /**
     * Called by parse().
     * 
     * @param {object} graphData The graph data to be parsed.
     * @param {NodeGraph} targetGraph The target graph to parse data to.
     * @returns {NodeGraph} The targetGraph.
     */
    onParseGraphCreate(graphData, targetGraph)
    {
        const hasQuad = graphData['quad'] || false;
        if (!targetGraph)
        {
            targetGraph = new NodeGraph(GraphNode, hasQuad ? QuadraticEdge : GraphEdge);
        }
        else
        {
            targetGraph.clear();
        }
        return targetGraph;
    }

    /**
     * Called by parse(), after onParserGraphCreate().
     *
     * @param {object} nodeData The node data.
     * @param {Node} targetNode The target graph node.
     */
    onParseNode(nodeData, targetNode)
    {
        // Nothing else needs to be done :3
    }

    /**
     * Called by parse(), after onParserGraphCreate().
     *
     * @param {object} edgeData The edge data.
     * @param {Edge} targetEdge The target graph edge.
     */
    onParseEdge(edgeData, targetEdge)
    {
        if (targetEdge instanceof QuadraticEdge)
        {
            const quadData = edgeData['quad'] || {};
            targetEdge.setQuadraticRadians(quadData['radians'] || 0);
            targetEdge.setQuadraticLength(quadData['length'] || 0);
        }
    }

    /**
     * Called by parse().
     *
     * @param {object} graphData The graph data.
     * @param {NodeGraph} targetGraph The target graph.
     */
    onParseGraphResult(graphData, targetGraph)
    {
        // Everything is handled so far...
    }

    /**
     * Called by compose().
     *
     * @param {NodeGraph} graph The graph to compose.
     * @param {object} graphData The destination graph data.
     * @returns {object} The composed graph data.
     */
    onComposeGraphCreate(graph, graphData)
    {
        return graphData || {};
    }

    /**
     * Called by compose().
     *
     * @param node
     * @param nodeData
     */
    onComposeNode(node, nodeData)
    {
        // Yep. It's all good.
    }

    /**
     * Called by compose().
     *
     * @param edge
     * @param edgeData
     */
    onComposeEdge(edge, edgeData)
    {
        if (edge instanceof QuadraticEdge)
        {
            const quad = edge.getQuadratic() || {};
            edgeData['quad'] = {
                radians: quad['radians'] || 0,
                length: quad['length'] || 0
            };
        }
    }

    /**
     * Called by compose().
     *
     * @param graph
     * @param graphData
     */
    onComposeGraphResult(graph, graphData)
    {
        let hasQuad = false;
        const edges = graph.getEdges();
        for (const edge of edges)
        {
            if (edge instanceof QuadraticEdge)
            {
                hasQuad = true;
                break;
            }
        }
        graphData['hasQuad'] = hasQuad;
    }
}

export const INSTANCE = new NodeGraphParser();
export default NodeGraphParser;
