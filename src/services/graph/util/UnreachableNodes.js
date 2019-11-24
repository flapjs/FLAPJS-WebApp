/**
 * Gets all unreachable nodes from the first node.
 * 
 * @param {IndexedNodeGraph} graph The target node graph to compute.
 * @returns {Array<GraphNode>} The unreachable nodes.
 */
export function getUnreachableNodes(graph)
{
    if (graph.getNodeCount() <= 1) return [];

    const edges = graph.getEdges();
    const nodes = graph.getNodes().slice();
    const startNode = nodes.shift();
    let nextNodes = [];
    nextNodes.push(startNode);

    while (nextNodes.length > 0)
    {
        const node = nextNodes.pop();
        for (const edge of edges)
        {
            if (edge.getEdgeFrom() === node)
            {
                const i = nodes.indexOf(edge.getEdgeTo());
                if (i >= 0)
                {
                    const nextNode = nodes.splice(i, 1)[0];
                    nextNodes.push(nextNode);
                }
            }
        }
    }

    return nodes;
}
