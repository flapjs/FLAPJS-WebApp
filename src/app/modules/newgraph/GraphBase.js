import { guid } from 'util/MathHelper.js';

class NodeBase
{
  constructor(x, y, id)
  {
    this.x = x;
    this.y = y;
    this.label = "";

    this._id = id;
  }

  get id()
  {
    return this._id;
  }
}

class EdgeBase
{
  constructor(from, to, id)
  {
    if (!from) throw new Error("Cannot create sourceless edge");

    this.from = from;
    this.to = to;
    this.label = "";

    this._id = id;
  }

  get id()
  {
    return this._id;
  }

  get x()
  {
    return this.to ?
      this.from.x + (this.to.x - this.from.x) / 2 :
      this.from.x;
  }

  get y()
  {
    return this.to ?
      this.from.y + (this.to.y - this.from.y) / 2 :
      this.from.y;
  }

  get dx()
  {
    return this.to ? this.to.x - this.from.x : 0;
  }

  get dy()
  {
    return this.to ? this.to.y - this.from.y : 0;
  }
}

class GraphBase
{
  constructor(nodes=[], edges=[])
  {
    this._nodes = nodes;
    this._edges = edges;
  }

  deleteAll()
  {
    this._nodes.length = 0;
    this._edges.length = 0;
  }

  newNode(x, y)
  {
    const result = new NodeBase(x || 0, y || 0, guid());
    this._nodes.push(result);
    return result;
  }

  deleteNode(node)
  {
    this._nodes.splice(this._nodes.indexOf(node), 1);
  }

  newEdge(from, to)
  {
    const result = new EdgeBase(from, to || null, guid());
    this._edges.push(result);
    return result;
  }

  deleteEdge(edge)
  {
    this._edges.splice(this._edges.indexOf(edge), 1);
  }

  getNodes()
  {
    return this._nodes;
  }

  getEdges()
  {
    return this._edges;
  }

  isEmpty()
  {
    return this._nodes.length <= 0;
  }

  getBoundingRect()
  {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for(let node of this._nodes)
    {
      const x = node.x;
      const y = node.y;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }

    for(let edge of this._edges)
    {
      const x = edge.x;
      const y = edge.y;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }

    return {
      minX: minX,
      minY: minY,
      maxX: maxX,
      maxY: maxY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
}

export default GraphBase;
export { NodeBase, EdgeBase };
