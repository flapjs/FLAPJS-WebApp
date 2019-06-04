import NodeGraph from '../NodeGraph.js';

import GraphNode from '../elements/GraphNode.js';
import GraphEdge from '../elements/GraphEdge.js';
import QuadraticEdge from '../elements/QuadraticEdge.js';

const GRAPH_PARSER_VERSION = '1.0.0';

export const JSON = {
    parse(data, dst=null)
    {
        const nodeDatas = data['nodes'] || [];
        const nodeCount = Math.min(nodeDatas.length || 0, data['nodeCount'] || 0);
        const edgeDatas = data['edges'] || [];
        const edgeCount = Math.min(edgeDatas.length || 0, data['edgeCount'] || 0);
        const hasQuad = data['quad'] || false;

        if (!dst) dst = new NodeGraph(GraphNode, hasQuad ? QuadraticEdge : GraphEdge);
        else dst.clear();

        const nodeIndices = new Map();
        for(let i = 0; i < nodeCount; ++i)
        {
            const nodeData = nodeDatas[i];
            if (!nodeData) continue;

            //NOTE: Assumes createNode will maintain order
            const node = dst.createNode(nodeData['x'] || 0, nodeData['y'] || 0, nodeData['id']);
            node.setNodeLabel(nodeData['label'] || '');

            nodeIndices.set(i, node);
        }

        for(let i = 0; i < edgeCount; ++i)
        {
            const edgeData = edgeDatas[i];
            if (!edgeData) continue;
            const sourceNode = nodeIndices.get(edgeData['from']) || null;
            //Cannot create source-less edges
            if (!sourceNode) continue;
            const destinationNode = nodeIndices.get(edgeData['to']) || null;
            //NOTE: Assumes createEdge will maintain order
            const edge = dst.createEdge(sourceNode, destinationNode, edgeData['id']);
            edge.setEdgeLabel(edgeData['label'] || '');

            if (edge instanceof QuadraticEdge)
            {
                const quadData = edgeData['quad'] || {};
                edge.setQuadraticRadians(quadData['radians'] || 0);
                edge.setQuadraticLength(quadData['length'] || 0);
            }
        }

        return dst;
    },
    objectify(graph)
    {
        const graphNodes = graph.getNodes() || [];
        const nodeCount = graphNodes.length || 0;
        const graphEdges = graph.getEdges() || [];
        const edgeCount = graphEdges.length || 0;

        const nodeDatas = new Array(nodeCount);
        const nodeIndices = new Map();
        for(let i = 0; i < nodeCount; ++i)
        {
            const node = graphNodes[i];
            if (node)
            {
                //NOTE: Assumes node must have an id
                const elementID = node.getGraphElementID();

                nodeIndices.set(node, i);
                nodeDatas[i] = {
                    id: elementID,
                    x: node.x || 0, y: node.y || 0,
                    label: node.getNodeLabel() || ''
                };
            }
        }

        let flag = false;
        const edgeDatas = new Array(edgeCount);
        for(let i = 0; i < edgeCount; ++i)
        {
            const edge = graphEdges[i];
            if (edge)
            {
                //NOTE: Assumes edge must have an id
                const elementID = edge.getGraphElementID();

                const quad = edge.getQuadratic() || {};
                const edgeSource = edge.getEdgeFrom();
                const edgeDestination = edge.getEdgeTo();
                const sourceIndex = nodeIndices.has(edgeSource) ? nodeIndices.get(edgeSource) : -1;
                const destinationIndex = nodeIndices.has(edgeDestination) ? nodeIndices.get(edgeDestination) : -1;
                edgeDatas[i] = {
                    id: elementID,
                    from: sourceIndex,
                    to: destinationIndex,
                    label: edge.getEdgeLabel() || ''
                };

                if (edge instanceof QuadraticEdge)
                {
                    flag = true;
                    edgeDatas[i]['quad'] = {
                        radians: quad['radians'] || 0,
                        length: quad['length'] || 0
                    };
                }
            }
        }

        return {
            nodeCount: nodeCount,
            nodes: nodeDatas,
            edgeCount: edgeCount,
            edges: edgeDatas,
            hasQuad: flag,
            _version: GRAPH_PARSER_VERSION
        };
    }
};