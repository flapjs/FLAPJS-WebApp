import NodeGraphParser from 'graph2/NodeGraphParser.js';

import SemanticVersion from 'util/version/SemanticVersion.js';
import FSAGraph from './FSAGraph.js';

export const VERSION_STRING = '1.0.0';
export const VERSION = SemanticVersion.parse(VERSION_STRING);

class FSAGraphParser extends NodeGraphParser
{
    constructor() { super(); }
    
    /**
     * @override
     * @param  {Object} data          the graph data to parse
     * @param  {FSAGraph} [dst=null]  the target to set parsed graph data
     * @return {FSAGraph}             the result in the passed-in dst
     */
    parse(data, dst = null) { return super.parse(data, dst); }

    /**
     * @override
     * @param  {FSAGraph} target      the graph to compose into data
     * @param  {Object} [dst=null]    the object to append graph data
     * @return {Object}               the result in the passed-in dst
     */
    compose(target, dst = null) { return super.compose(target, dst); }

    /** @override */
    onParseGraphCreate(graphData, targetGraph)
    {
        if (!targetGraph)
        {
            targetGraph = new FSAGraph();
        }
        else
        {
            targetGraph.clear();
        }

        return targetGraph;
    }

    /** @override */
    onParseGraphResult(graphData, targetGraph)
    {
        const nodeIndices = this._nodeIndices;
        const initialIndex = graphData['initial'] || 0;
        const initialNode = nodeIndices.get(initialIndex);
        if (initialNode)
        {
            targetGraph.setStartNode(initialNode);
        }
    }

    /** @override */
    onParseNode(nodeData, targetNode)
    {
        targetNode.setNodeAccept(nodeData['accept'] || false);
        targetNode.setNodeCustom(nodeData['custom'] || false);
    }
    
    /** @override */
    onComposeNode(node, nodeData)
    {
        nodeData['accept'] = node.getNodeAccept() || false;
        nodeData['custom'] = node.getNodeCustom() || false;
    }

    /** @override */
    onComposeGraphResult(graph, graphData)
    {
        const nodeIndices = this._nodeIndices;
        const graphInitial = graph.getStartNode();
        const initialIndex = nodeIndices.get(graphInitial) || 0;
        graphData['initial'] = initialIndex;
    }
}

export default FSAGraphParser;
