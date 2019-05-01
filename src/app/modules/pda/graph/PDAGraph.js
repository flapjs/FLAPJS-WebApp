import NodalGraph from 'graph/NodalGraph.js';
import PDANode from './PDANode.js';
import PDAEdge, { LINE_SEPARATOR } from './PDAEdge.js';

const PARALLEL_EDGE_HEIGHT = 10;

class PDAGraph extends NodalGraph
{
  constructor()
  {
    super(PDANode, PDAEdge);
  }

  setStartNode(node)
  {
    if (this._nodes.length <= 0) throw new Error("Cannot set start node to empty graph");

    //There is only one node, and that is already the start node
    if (this._nodes.length === 1) return;

    const i = this._nodes.indexOf(node);
    if (i > 0)
    {
      //This does a swap; we could do a prepend but that's more costly...
      const prev = this._nodes[0];
      this._nodes[0] = node;
      this._nodes[i] = prev;
    }
    else if (i < 0)
    {
      throw new Error("Cannot set start node for unknown node");
    }
  }

  getStartNode()
  {
    return this._nodes.length > 0 ? this._nodes[0] : null;
  }

  //This is more like addEdge() without adding it to the graph and just returns the result
  //This should only be called once when completing an edge
  /** @override */
  formatEdge(edge)
  {
    const edgeSource = edge.getSourceNode();
    const edgeDestination = edge.getDestinationNode();
    const edgeLabel = edge.getEdgeLinesFromLabel();

    //Look for an existing edge with similar from and to
    for(const otherEdge of this._edges)
    {
      if (otherEdge === edge) continue;
      if (otherEdge.getSourceNode() === edgeSource && otherEdge.getDestinationNode() === edgeDestination)
      {
        const otherLines = otherEdge.getEdgeLinesFromLabel();
        if (edgeLabel.length > 0)
        {
          const result = otherLines.concat(edgeLabel);
          otherEdge.setEdgeLabel(result.join(LINE_SEPARATOR));
        }

        //Merged with newfound edge...
        return otherEdge;
      }
    }

    //Otherwise, format the current edge

    if (!edge.isSelfLoop())
    {
      let flag = false;

      //Bend away if there is another edge not bent with the same src/dst
      const parallelEdgeHeight = PARALLEL_EDGE_HEIGHT;
      const HALFPI = Math.PI / 2;
      for(const otherEdge of this._edges)
      {
        if (otherEdge.isQuadratic() && Math.abs(otherEdge.getQuadratic().length) >= parallelEdgeHeight * 2) continue;
        if ((otherEdge.getDestinationNode() === edgeSource && otherEdge.getSourceNode() === edgeDestination))
        {
          edge.setQuadratic(HALFPI, parallelEdgeHeight);
          otherEdge.setQuadratic(HALFPI, parallelEdgeHeight);
          flag = true;

          //ASSUMES that there will only ever be 2 edges that are parallel...
          break;
        }
      }

      //Try to move the edge away from intersecting nodes...
      if (!flag)
      {
        const maxNodeSize = Math.max(edgeSource.getNodeSize(), edgeDestination.getNodeSize());
        const x1 = edgeSource.x;
        const y1 = edgeSource.y;
        const x2 = edgeDestination.x;
        const y2 = edgeDestination.y;
        const dist12sq = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        let vertical = false;
        let m = 0;
        let b = 0;

        if(x1 > x2)
        {
          m = (y1-y2) / (x1-x2);
          b = y2-m*x2;
        }
        else if (x1 < x2)
        {
          m = (y2-y1) / (x2-x1);
          b = y1-m*x1;
        }
        else
        {
          vertical = true;
        }

        for(const node of this._nodes)
        {
          if(node === edgeSource || node === edgeDestination) continue;

          const x0 = node.x;
          const y0 = node.y;

          const dist01sq = (x1-x0)*(x1-x0) + (y1-y0)*(y1-y0);
          const dist02sq = (x2-x0)*(x2-x0) + (y2-y0)*(y2-y0);
          if(dist01sq > dist12sq || dist02sq > dist12sq) continue;

          let dist = 0;
          if(vertical) {
            dist = Math.abs(x1-x0);
          } else {
            dist = Math.abs(b+ m*x0 - y0) / Math.sqrt(1+m*m);
          }

          if(dist < node.getNodeSize())
          {
            flag = true;
            break;
          }
        }

        if (flag)
        {
          edge.setQuadratic(-Math.PI / 2, maxNodeSize + 10);
        }
      }
    }

    return edge;
  }
}

export default PDAGraph;
