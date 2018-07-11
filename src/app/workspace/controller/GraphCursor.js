import * as Config from 'config.js';

class GraphCursor
{
  constructor(graph, mouse)
  {
    this.graph = graph;
    this.mouse = mouse;
  }

  getNodesWithin(fromX, fromY, toX, toY, dst)
  {
    for(const node of this.graph.nodes)
    {
      if (node.x >= fromX && node.x < toX &&
          node.y >= fromY && node.y < toY)
      {
        dst.push(node);
      }
    }
  }

  getNodeAt(x, y)
  {
    for(const node of this.graph.nodes)
    {
      const dx = x - node.x;
      const dy = y - node.y;
      if (dx * dx + dy * dy < Config.NODE_RADIUS_SQU)
      {
        return node;
      }
    }

    return null;
  }

  getEdgeAt(x, y)
  {
    for(const edge of this.graph.edges)
    {
      const dx = x - edge.x;
      const dy = y - edge.y;
      if (dx * dx + dy * dy < Config.EDGE_RADIUS_SQU)
      {
        return edge;
      }
    }

    return null;
  }

  getEdgeByEndPointAt(x, y)
  {
    for(const edge of this.graph.edges)
    {
      const point = edge.getEndPoint();
      const dx = x - point[0];
      const dy = y - point[1];
      if (dx * dx + dy * dy < Config.ENDPOINT_RADIUS_SQU)
      {
        return edge;
      }
    }

    return null;
  }
}

export default GraphCursor;
