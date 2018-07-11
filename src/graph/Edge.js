import { NODE_RADIUS, PLACEHOLDER_LENGTH } from 'config.js';

class Edge
{
  constructor(graph, from, to, label="#")
  {
    this.graph = graph;
    this.from = from;
    this.quad = {x: 0, y: 0};

    this._to = to;
    this._label = label;
  }

  getStartPoint()
  {
    const from = this.from;
    const to = this.to;
    const quad = this.quad;

    if (!from) throw new Error("Source of edge cannot be null.");
    if (!to)
    {
      if (this.props.proxy)
      {
        const dir = getDirectionalVector(from.x, from.y,
          this.graph.pointer.x, this.graph.pointer.y, radius, 0);

        //Reuse created object for result...
        dir.x = from.x + dir.x;
        dir.y = from.y + dir.y;
        return dir;
      }
      else
      {
        //TODO: Make sure to use quad for placeholder direction (not magnitude)
        return {
          x: from.x + quad.x * NODE_RADIUS,
          y: from.y + quad.y * NODE_RADIUS
        };
      }
    }

    const fromx = from.x;
    const fromy = from.y;
    const tox = to.x;
    const toy = to.y;
    const quadx = quad.x;
    const quady = quad.y;

    const selfLoop = (from == to);

    if (quadx == 0 && quady == 0)
    {
      const dir = getDirectionalVector(fromx, fromy, tox, toy, NODE_RADIUS, 0);

      //Reuse created object for result...
      dir.x = fromx + dir.x;
      dir.y = fromy + dir.y;
      return dir;
    }
    else
    {
      const midpoint = getMidPoint(fromx, fromy, tox, toy);
      const qx = midpoint.x + (quadx * 2);
      const qy = midpoint.y + (quady * 2);

      const dir = getDirectionalVector(fromx, fromy, qx, qy, NODE_RADIUS,
        selfLoop ? (Math.PI / 4) : 0);

      //Reuse created object for result...
      dir.x = fromx + dir.x;
      dir.y = fromy + dir.y;
      return dir;
    }
  }

  getEndPoint()
  {
    const from = this.from;
    const to = this.to;
    const quad = this.quad;

    if (!from) throw new Error("Source of edge cannot be null.");
    if (!to)
    {
      if (this.graph.proxyEdge === this)
      {
        //If proxyEdge, follow the cursor instead
        return this.graph.pointer;
      }
      else
      {
        //TODO: Make sure to use quad for placeholder direction (not magnitude)
        return {
          x: from.x + quad.x * (NODE_RADIUS + PLACEHOLDER_LENGTH),
          y: from.y + quad.y * (NODE_RADIUS + PLACEHOLDER_LENGTH)
        };
      }
    }

    const fromx = from.x;
    const fromy = from.y;
    const tox = to.x;
    const toy = to.y;
    const quadx = quad.x;
    const quady = quad.y;

    const selfLoop = (from == to);

    //Get end point for straight edges...
    if (quadx == 0 && quady == 0)
    {
      const dir = getDirectionalVector(fromx, fromy, tox, toy, NODE_RADIUS, 0);

      //Reuse created object for result...
      dir.x = tox - dir.x;
      dir.y = toy - dir.y;
      return dir;
    }
    //Get end point for quadratics...
    else
    {
      const midpoint = getMidPoint(fromx, fromy, tox, toy);
      const qx = midpoint.x + (quadx * 2);
      const qy = midpoint.y + (quady * 2);

      const dir = getDirectionalVector(qx, qy, tox, toy, NODE_RADIUS,
        selfLoop ? -(Math.PI / 4) : 0);

      //Reuse created object for result...
      dir.x = tox - dir.x;
      dir.y = toy - dir.y;
      return dir;
    }
  }

  getCenterPoint()
  {
    const from = this.from;
    const to = this.to;
    const quad = this.quad;

    if (!from) throw new Error("Source of edge cannot be null.");
    if (!to)
    {
      if (this.graph.proxyEdge == this)
      {
        //If proxyEdge, follow the cursor instead
        const midpoint = getMidPoint(from.x, from.y,
          this.graph.pointer.x, this.graph.pointer.y);

        if (quadx != 0 || quady != 0)
        {
          midpoint.x += quadx;
          midpoint.y += quady;
        }
        return midpoint;
      }
      else
      {
        //TODO: Make sure to use quad for placeholder direction (not magnitude)
        return {
          x: from.x + quad.x * (NODE_RADIUS + PLACEHOLDER_LENGTH / 2),
          y: from.y + quad.y * (NODE_RADIUS + PLACEHOLDER_LENGTH / 2)
        };
      }
    }

    const fromx = from.x;
    const fromy = from.y;
    const tox = to.x;
    const toy = to.y;
    const quadx = quad.x;
    const quady = quad.y;

    const midpoint = getMidPoint(fromx, fromy, tox, toy);
    if (quadx != 0 || quady != 0)
    {
      midpoint.x += quadx;
      midpoint.y += quady;
    }
    return midpoint;
  }

  get x() {
    return this.quad.x + this.centerX;
  }
  get y() {
    return this.quad.y + this.centerY;
  }

  set x(value) {
    this.quad.x = value - this.centerX;
    if (Math.abs(this.quad.x) < 8) this.quad.x = 0;
    if (this.quad.x == 0 && this.quad.y == 0) this.quad = null;
  }
  set y(value) {
    this.quad.y = value - this.centerY;
    if (Math.abs(this.quad.y) < 8) this.quad.y = 0;
    if (this.quad.x == 0 && this.quad.y == 0) this.quad = null;
  }

  get label() { return this._label; }
  set label(value) {
    let prevLabel = this._label;
    this._label = value;
    this.graph.emit("edgeLabel", this, this._label, prevLabel);
  }

  get to() { return this._to; }
  set to(value) {
    let prevDst = this._to;
    this._to = value;
    this.graph.emit("edgeDestination", this, this._to, prevDst);
  }

  makePlaceholder()
  {
    const dx = this.to ? this.from.x - this.to.x : 1;
    const dy = this.to ? this.from.y - this.to.y : 0;
    const angle = -Math.atan2(dx, dy) - (Math.PI / 2);

    this.quad.x = Math.cos(angle);
    this.quad.y = Math.sin(angle);
    this.to = null;
  }

  isPlaceholder()
  {
    return !this.to;
  }

  isSelfLoop()
  {
    return this.from == this.to;
  }
}

function getDirectionalVector(x1, y1, x2, y2, dist, angleOffset=0)
{
  const dx = x1 - x2;
  const dy = y1 - y2;
  const angle = -Math.atan2(dy, dx) - (Math.PI / 2) + angleOffset;
  return {
    x: Math.sin(angle) * dist,
    y: Math.cos(angle) * dist
  };
}

function getMidPoint(x1, y1, x2, y2)
{
  return {
    x: x1 + (x2 - x1) / 2,
    y: y1 + (y2 - y1) / 2
  };
}

export default Edge;
