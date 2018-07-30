import { NODE_RADIUS, PLACEHOLDER_LENGTH, SELF_LOOP_HEIGHT } from 'config.js';
import Node from './Node.js';

class Edge
{
  constructor(graph, from, to, label)
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
      //TODO: Make sure to use quad for placeholder direction (not magnitude)
      return {
        x: from.x + quad.x * NODE_RADIUS,
        y: from.y + quad.y * NODE_RADIUS
      };
    }
    else if (!(to instanceof Node))
    {
      const dir = getDirectionalVector(from.x, from.y, to.x, to.y, NODE_RADIUS, 0);

      //Reuse created object for result...
      dir.x = from.x + dir.x;
      dir.y = from.y + dir.y;
      return dir;
    }

    const fromx = from.x;
    const fromy = from.y;
    const tox = to.x;
    const toy = to.y;
    const quadx = quad.x;
    const quady = quad.y;

    if (!this.isQuadratic())
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
        this.isSelfLoop() ? (Math.PI / 4) : 0);

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
      //TODO: Make sure to use quad for placeholder direction (not magnitude)
      return {
        x: from.x + quad.x * (NODE_RADIUS + PLACEHOLDER_LENGTH),
        y: from.y + quad.y * (NODE_RADIUS + PLACEHOLDER_LENGTH)
      };
    }
    else if (!(to instanceof Node))
    {
      return to;
    }

    const fromx = from.x;
    const fromy = from.y;
    const tox = to.x;
    const toy = to.y;
    const quadx = quad.x;
    const quady = quad.y;

    //Get end point for straight edges...
    if (!this.isQuadratic())
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
        this.isSelfLoop() ? -(Math.PI / 4.0) : 0);

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
      //TODO: Make sure to use quad for placeholder direction (not magnitude)
      return {
        x: from.x + quad.x * (NODE_RADIUS + PLACEHOLDER_LENGTH / 2),
        y: from.y + quad.y * (NODE_RADIUS + PLACEHOLDER_LENGTH / 2)
      };
    }
    else if (!(to instanceof Node))
    {
      const midpoint = getMidPoint(from.x, from.y, to.x, to.y);

      if (this.isQuadratic())
      {
        midpoint.x += quad.x;
        midpoint.y += quad.y;
      }
      return midpoint;
    }

    const fromx = from.x;
    const fromy = from.y;
    const tox = to.x;
    const toy = to.y;
    const quadx = quad.x;
    const quady = quad.y;

    const midpoint = getMidPoint(fromx, fromy, tox, toy);
    if (this.isQuadratic())
    {
      midpoint.x += quadx;
      midpoint.y += quady;
    }
    return midpoint;
  }

  get x() {
    return this.getCenterPoint().x;
  }
  get y() {
    return this.getCenterPoint().y;
  }

  setQuadraticByAbsolute(x, y)
  {
    const midpoint = getMidPoint(this.from.x, this.from.y, this.to.x, this.to.y);
    this.setQuadraticByRelative(x - midpoint.x, y - midpoint.y);
  }

  setQuadraticByRelative(dx, dy)
  {
    this.quad.x = dx;
    this.quad.y = dy;
    if (Math.abs(this.quad.x) < 8) this.quad.x = 0;
    if (Math.abs(this.quad.y) < 8) this.quad.y = 0;
  }

  setLabel(label)
  {
    this._label = label;

    this.graph.markDirty();
  }

  get label() { return this._label; }
  set label(value) {
    let prevLabel = this._label;
    this._label = value;

    if (prevLabel != value)
    {
      this.graph.emit("edgeLabel", this, this._label, prevLabel);

      this.graph.markDirty();
    }
  }

  get to() { return this._to; }
  set to(value) {
    let prevDst = this._to;
    this._to = value;

    //Default
    this.quad.x = 0;
    this.quad.y = 0;//this.from.y - SELF_LOOP_HEIGHT;

    if (prevDst !== this._to)
    {
      this.graph.emit("edgeDestination", this, this._to, prevDst);
      this.graph.markDirty();
    }
  }

  makeSelfLoop(angle)
  {
    //If not already a self loop, make it so.
    if (this.from !== this.to)
    {
      this.to = this.from;
    }
    this.setQuadraticByRelative(-Math.cos(angle) * SELF_LOOP_HEIGHT,
      -Math.sin(angle) * SELF_LOOP_HEIGHT);
  }

  makePlaceholder()
  {
    const prev = this.to;

    //If not already a placeholder, make it so.
    if (this.to !== null)
    {
      this.to = null;
    }

    const dx = prev ? this.from.x - prev.x : -1;
    const dy = prev ? this.from.y - prev.y : 0;
    const angle = -Math.atan2(dx, dy) - (Math.PI / 2);

    //Quad is re-used to determine edge angle for placeholder
    this.quad.x = Math.cos(angle);
    this.quad.y = Math.sin(angle);
  }

  isPlaceholder()
  {
    return !this.to;
  }

  isSelfLoop()
  {
    return this.from === this.to;
  }

  isQuadratic()
  {
    return !this.isPlaceholder() && (this.quad.x != 0 || this.quad.y != 0);
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
