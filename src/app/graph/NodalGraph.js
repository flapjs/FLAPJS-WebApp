import GraphNode from './GraphNode.js';
import GraphEdge from './GraphEdge.js';
import { guid, stringHash } from 'util/MathHelper.js';

class NodalGraph
{
  constructor(nodeClass=GraphNode, edgeClass=GraphEdge)
  {
    this._nodeClass = nodeClass;
    this._edgeClass = edgeClass;

    this._nodes = [];
    this._edges = [];
    this._nodeMapping = new Map();
    this._edgeMapping = new Map();
  }

  //This is more like addEdge() without adding it to the graph and just returns the result
  //This should only be called once when completing an edge
  formatEdge(edge)
  {
    return edge;
  }

  /** NODES **/

  createNode(x=0, y=0, id=null)
  {
    const result = new (this._nodeClass)(id || guid(), x, y);
    const i = this._nodes.length;
    this._nodes.push(result);
    this._nodeMapping.set(result.getGraphElementID(), i);
    return result;
  }
  deleteNode(node)
  {
    const elementID = node.getGraphElementID();
    const i = this._nodeMapping.get(elementID);
    if (i >= 0)
    {
      this._nodes.splice(i, 1);
      this._nodeMapping.delete(elementID);

      //HACK: This is inefficient, you should convert everything to use only
      //the map so the indicies would not need to be fixed in the array.
      //Basically, get rid of this._nodes (you will have to change how setStartNode works)
      for(let j = i, len = this._nodes.length; j < len; ++j)
      {
        this._nodeMapping.set(this._nodes[j].getGraphElementID(), j);
      }

      const nullSourceEdges = [];

      //Remove connected edges
      for(const edge of this._edges)
      {
        if (edge.getSourceNode() === node)
        {
          nullSourceEdges.push(edge);
        }
        else if (edge.getDestinationNode() === node)
        {
          edge.changeDestinationNode(null);
        }
      }
      for(const edge of nullSourceEdges)
      {
        this.deleteEdge(edge);
      }
    }
  }
  addNode(node)
  {
    if (!node.getGraphElementID()) node.setGraphElementID(guid());

    const i = this._nodes.length;
    this._nodes.push(node);
    this._nodeMapping.set(node.getGraphElementID(), i);
    return node;
  }
  clearNodes() { this._nodes.length = 0; this._nodeMapping.clear(); }
  getNodeByElementID(elementID)
  {
    const index = this._nodeMapping.get(elementID);
    return index >= 0 ? this._nodes[index] : null;
  }
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
  getNodeClass() { return this._nodeClass; }

  /** EDGES **/

  createEdge(from, to=null, id=null)
  {
    const result = new (this._edgeClass)(id || guid(), from, to);
    const i = this._edges.length;
    this._edges.push(result);
    this._edgeMapping.set(result.getGraphElementID(), i);
    return result;
  }
  deleteEdge(edge)
  {
    const elementID = edge.getGraphElementID();
    const i = this._edgeMapping.get(elementID);
    if (i >= 0)
    {
      this._edges.splice(i, 1);
      this._edgeMapping.delete(elementID);

      //HACK: This is inefficient, refer to deleteNode().
      for(let j = i, len = this._edges.length; j < len; ++j)
      {
        this._edgeMapping.set(this._edges[j].getGraphElementID(), j);
      }
    }
  }
  addEdge(edge)
  {
    if (!edge.getGraphElementID()) edge.setGraphElementID(guid());

    const i = this._edges.length;
    this._edges.push(edge);
    this._edgeMapping.set(edge.getGraphElementID(), i);
    return edge;
  }
  clearEdges() { this._edges.length = 0; this._edgeMapping.clear(); }
  getEdgeByElementID(elementID)
  {
    const index = this._edgeMapping.get(elementID);
    return index >= 0 ? this._edges[index] : null;
  }
  getEdges() { return this._edges; }
  getEdgeCount() { return this._edges.length; }
  getEdgeClass() { return this._edgeClass; }

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

  //Gets a hash of the graph's current state. Can generally assume the hash will
  //change if the graph's content has changed (including nodes and edges).
  getHashCode(usePosition=true)
  {
    let string = "";
    for(const node of this._nodes)
    {
      string += node.getHashString(usePosition) + ",";
    }
    string += "|";
    for(const edge of this._edges)
    {
      string += edge.getHashString(usePosition) + ",";
    }
    return stringHash(string);
  }
}

export default NodalGraph;
