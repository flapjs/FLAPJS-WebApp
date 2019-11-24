import PDAGraph from '../graph/PDAGraph.js';

const GRAPH_PARSER_VERSION = '1.0.0';

export const INSTANCE = {
    parse(data, dst=null)
    {
        if (!dst) dst = new PDAGraph();
        else dst.clear();

        const nodeDatas = data['nodes'] || [];
        const nodeCount = Math.min(nodeDatas.length || 0, data['nodeCount'] || 0);
        const edgeDatas = data['edges'] || [];
        const edgeCount = Math.min(edgeDatas.length || 0, data['edgeCount'] || 0);
        const initialIndex = data['initial'] || 0;

        const nodeIndices = new Map();
        for(let i = 0; i < nodeCount; ++i)
        {
            const nodeData = nodeDatas[i];
            if (!nodeData) continue;

            //NOTE: Assumes createNode will maintain order
            const node = dst.createNode(nodeData['x'] || 0, nodeData['y'] || 0, nodeData['id']);
            node.setNodeLabel(nodeData['label'] || '');
            node.setNodeAccept(nodeData['accept'] || false);
            node.setNodeCustom(nodeData['custom'] || false);

            nodeIndices.set(i, node);
        }

        const initialNode = nodeIndices.get(initialIndex);
        if (initialNode)
        {
            dst.setStartNode(initialNode);
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
            const quadData = edgeData['quad'] || {};
            edge.setEdgeLabel(edgeData['label'] || '');
            edge.setQuadraticRadians(quadData['radians'] || 0);
            edge.setQuadraticLength(quadData['length'] || 0);
        }

        return dst;
    },
    compose(graph)
    {
        const graphNodes = graph.getNodes() || [];
        const nodeCount = graphNodes.length || 0;
        const graphEdges = graph.getEdges() || [];
        const edgeCount = graphEdges.length || 0;
        const graphInitial = graph.getStartNode();

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
                    label: node.getNodeLabel() || '',
                    accept: node.getNodeAccept() || false,
                    custom: node.getNodeCustom() || false
                };
            }
        }

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
                    quad: { radians: quad['radians'] || 0, length: quad['length'] || 0 },
                    label: edge.getEdgeLabel() || ''
                };
            }
        }

        const initialIndex = nodeIndices.get(graphInitial) || 0;

        return {
            nodeCount: nodeCount,
            nodes: nodeDatas,
            edgeCount: edgeCount,
            edges: edgeDatas,
            initial: initialIndex,
            _version: GRAPH_PARSER_VERSION
        };
    }
};
