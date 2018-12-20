import GraphNode from './GraphNode.js';
import GraphEdge from './GraphEdge.js';
import { guid, stringHash } from 'util/MathHelper.js';

const HASH_TIME_BITSHIFT_AMT = 14;//refresh about every 16 secs = [(2^n)/1000]

class NodalGraph
{
  constructor()
  {
    this._nodes = [];
    this._edges = [];
  }

  /** NODES **/

  createNode(x=0, y=0, id=guid())
  {
    const result = new GraphNode(id, x, y);
    this._nodes.push(result);
    return result;
  }
  deleteNode(node)
  {
    const i = this._nodes.indexOf(node);
    if (i >= 0) this._nodes.splice(1, i);
  }
  clearNodes() { this._nodes.length = 0; }
  getNodesByLabel(label, dst=[])
  {
    for(const node of this._nodes)
    {
      if (node.getNodeLabel() == label) dst.push(node);
    }
    return dst;
  }
  getNodes() { return this._nodes; }
  getNodeCount() { return this._nodes.length; }

  /** EDGES **/

  createEdge(from, to=null, id=guid())
  {
    const result = new GraphEdge(id, from, to);
    this._edges.push(result);
    return result;
  }
  deleteEdge(edge)
  {
    const i = this._edges.indexOf(edge);
    if (i >= 0) this._edges.splice(1, i);
  }
  clearEdges() { this._edges.length = 0; }
  getEdges() { return this._edges; }
  getEdgeCount() { return this._edges.length; }

  /** HELPER **/

  clear()
  {
    this.clearEdges();
    this.clearNodes();
  }

  isEmpty()
  {
    return this.getNodeCount() <= 0 && this.getEdgeCount() <= 0;
  }

  getBoundingRect()
  {
    if (this._nodes.length <= 0) return {
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
    for(const node of this._nodes)
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

    const startPoint = {x: 0, y: 0};
    const endPoint = {x: 0, y: 0};
    const centerPoint = {x: 0, y: 0};
    for(const edge of this._edges)
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

  //Gets a hash of the graph's current state. Can assume the hash will change
  //within a few cycles if the graph's content has changed (including nodes and
  //edges). The hash is also guaranteed to change at regular intervals,
  //regardless of whether the content has changed to ensure no changes go stale.
  getHashCode()
  {
    const date = new Date();
    //Signed shift right
    const time = date.getMilliseconds() >>> HASH_TIME_BITSHIFT_AMT;
    let string = time + ".";
    for(const node of this._nodes)
    {
      string += node.getHashCode() + ",";
    }
    string += ".";
    for(const edge of this._edges)
    {
      string += edge.getHashCode() + ",";
    }
    return stringHash(string);
  }
}

export default FSAGraph;
