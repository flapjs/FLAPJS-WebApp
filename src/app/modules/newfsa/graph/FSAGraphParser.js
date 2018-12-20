import FSAGraph from './FSAGraph.js';

export const JSON = {
  parse(data, dst=null)
  {
    if (!dst) dst = new FSAGraph();
    else dst.clear();

    const nodeDatas = data['nodes'] || [];
    const nodeCount = Math.min(nodeDatas.length || 0, data['nodeCount'] || 0);
    const edgeDatas = data['edges'] || [];
    const edgeCount = Math.min(edgeDatas.length || 0, data['edgeCount'] || 0);

    const nodeIndices = new Map();
    for(let i = 0; i < nodeCount; ++i)
    {
      const nodeData = nodeDatas[i] || {};
      //NOTE: Assumes createNode will maintain order
      const node = dst.createNode(nodeData['x'] || 0, nodeData['y'] || 0, nodeData['id']);
      node.setNodeLabel(nodeData['label'] || "");
      node.setNodeAccept(nodeData['accept'] || false);
      node.setNodeCustom(nodeData['custom'] || false);

      nodeIndices.set(i, node);
    }

    for(let i = 0; i < edgeCount; ++i)
    {
      const edgeData = edgeDatas[i] || {};
      const sourceNode = nodeIndices.get(edgeData['from']) || null;
      const destinationNode = nodeIndices.get(edgeData['to']) || null;
      //Cannot create source-less edges
      if (!sourceNode) continue;
      //NOTE: Assumes createEdge will maintain order
      const edge = dst.createEdge(sourceNode, destinationNode, edgeData['id']);
      const quadData = edgeData['quad'] || {};
      edge.setEdgeLabel(edgeData['label'] || "");
      edge.setQuadratic(quadData['radians'] || 0, quadData['length'] || 0);
    }

    return dst;
  },
  objectify(graph)
  {
    const graphNodes = graph.getNodes() || [];
    const nodeCount = nodes.length || 0;
    const graphEdges = graph.getEdges() || [];
    const edgeCount = edge.length || 0;

    const nodeDatas = new Array(nodeCount);
    const nodeIndices = new Map();
    for(let i = 0, len = nodeCount; i < len; ++i)
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
          label: node.getNodeLabel() || "",
          accept: node.getNodeAccept() || false,
          custom: node.getNodeCustom() || false
        };
      }
    }

    const edgeDatas = new Array(edgeCount);
    for(let i = 0, len = edgeCount; i < len; ++i)
    {
      const edge = graphEdges[i];
      if (edge)
      {
        //NOTE: Assumes edge must have an id
        const elementID = edge.getGraphElementID();

        const quad = edge.getQuadratic() || {};
        const sourceIndex = nodeIndices.get(edge.getSourceNode());
        const destinationIndex = nodeIndices.get(edge.getDestinationNode());
        edgeDatas[i] = {
          id: elementID,
          from: sourceIndex || -1,
          to: destinationIndex || -1,
          quad: { radians: quad['radians'] || 0, length: quad['length'] || 0 },
          label: edge.getEdgeLabel() || ""
        };
      }
    }

    return {
      nodeCount: nodeCount,
      nodes: nodeDatas,
      edgeCount: edgesCount,
      edges: edgeDatas
    };
  }
};

export const XML = {
  parse(data, dst)
  {

  },
  objectify(graph)
  {

  }
};
