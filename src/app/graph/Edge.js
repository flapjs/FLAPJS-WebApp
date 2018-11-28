import GraphEdge from 'graph/GraphEdge.js';
import Config from 'config.js';

import { guid } from 'util/MathHelper.js';
import Node from './Node.js';

class Edge extends GraphEdge
{
  constructor(graph, from, to, label)
  {
    super(guid(), from, to);

    this.graph = graph;

    //radians = the angle in radians, where 0 is the normal of midpoint
    //length = the distance from midpoint
    this._quad = {
      radians: 0,
      length: 0,
      _coords: {x: 0, y: 0}
    };

    this._label = label;
  }

  get from()
  {
    return this.getSourceNode();
  }

  set from(value)
  {
    this.setSourceNode(value);
  }

  copyQuadraticsFrom(src)
  {
    this.setQuadratic(src.radians, src.length);
  }

  copyQuadraticsTo(dst)
  {
    dst.radians = this._quad.radians;
    dst.length = this._quad.length;
    return dst;
  }

  setQuadratic(radians, length)
  {
    this._quad.radians = radians;
    this._quad.length = length;
  }

  getQuadratic()
  {
    return this._quad;
  }

  getQuadraticAsCoords()
  {
    const from = this.from;
    const to = this._to;
    const dst = this._quad._coords;
    if (from == null || to == null)
    {
      dst.x = 0;
      dst.y = 0;
    }
    else
    {
      /*
      _capture: {
        fx: 0, fy: 0,
        tx: 0, ty: 0,
        ql: 0, qr: 0
      }
      */
      getDirectionalVector(from.x, from.y, to.x, to.y,
        this._quad.length, this._quad.radians, dst);
    }
    return dst;
  }

  //Override
  getStartPoint()
  {
    const from = this.from;
    const to = this.to;

    if (!from) throw new Error("Source of edge cannot be null.");
    if (!to)
    {
      //Make sure to use quad for placeholder direction (not magnitude)
      const px = Math.cos(this._quad.radians);
      const py = Math.sin(this._quad.radians);
      const placeholderLength = Config.NODE_RADIUS;
      return {
        x: from.x + px * placeholderLength,
        y: from.y + py * placeholderLength
      };
    }

    const fromx = from.x;
    const fromy = from.y;
    const tox = to.x;
    const toy = to.y;

    if (!(to instanceof Node) || !this.isQuadratic())
    {
      const dir = getDirectionalVector(fromx, fromy, tox, toy,
        Config.NODE_RADIUS, 0, {x: 0, y: 0});
      dir.x += from.x;
      dir.y += from.y;
      return dir;
    }
    else
    {
      const midpoint = getMidPoint(fromx, fromy, tox, toy);
      const qcoords = this.getQuadraticAsCoords();
      const qx = midpoint.x + qcoords.x;
      const qy = midpoint.y + qcoords.y;
      const dir = getDirectionalVector(fromx, fromy, qx, qy,
        Config.NODE_RADIUS, this.isSelfLoop() ? (Math.PI / 4) : 0, {x: 0, y: 0});
      dir.x += fromx;
      dir.y += fromy;
      return dir;
    }
  }

  //Override
  getEndPoint()
  {
    const from = this.from;
    const to = this.to;

    if (!from) throw new Error("Source of edge cannot be null.");
    if (!to)
    {
      //Make sure to use quadCoords for placeholder direction (not magnitude)
      const px = Math.cos(this._quad.radians);
      const py = Math.sin(this._quad.radians);
      const placeholderLength = Config.NODE_RADIUS + Config.PLACEHOLDER_LENGTH;
      return {
        x: from.x + px * placeholderLength,
        y: from.y + py * placeholderLength
      };
    }

    const fromx = from.x;
    const fromy = from.y;
    const tox = to.x;
    const toy = to.y;

    //Get end point for non-nodes...
    if (!(to instanceof Node))
    {
      return to;
    }
    //Get end point for straight edges...
    else if (!this.isQuadratic())
    {
      const dir = getDirectionalVector(tox, toy, fromx, fromy,
        Config.NODE_RADIUS, 0, {x: 0, y: 0});
      dir.x += tox;
      dir.y += toy;
      return dir;
    }
    //Get end point for quadratics...
    else
    {
      const midpoint = getMidPoint(fromx, fromy, tox, toy);
      const qcoords = this.getQuadraticAsCoords();
      const qx = midpoint.x + qcoords.x;
      const qy = midpoint.y + qcoords.y;

      const dir = getDirectionalVector(tox, toy, qx, qy,
        Config.NODE_RADIUS, this.isSelfLoop() ? -(Math.PI / 4.0) : 0, {x: 0, y: 0});
      dir.x += tox;
      dir.y += toy;
      return dir;
    }
  }

  //Override
  getCenterPoint()
  {
    const from = this.from;
    const to = this.to;

    if (!from) throw new Error("Source of edge cannot be null.");
    if (!to)
    {
      //Make sure to use quad for placeholder direction (not magnitude)
      const px = Math.cos(this._quad.radians);
      const py = Math.sin(this._quad.radians);
      const placeholderLength = Config.NODE_RADIUS + Config.PLACEHOLDER_LENGTH / 2;

      return {
        x: from.x + px * placeholderLength,
        y: from.y + py * placeholderLength
      };
    }

    const fromx = from.x;
    const fromy = from.y;
    const tox = to.x;
    const toy = to.y;

    const midpoint = getMidPoint(fromx, fromy, tox, toy, {x: 0, y: 0});

    if (this.isQuadratic())
    {
      const qcoords = this.getQuadraticAsCoords();
      const qx = qcoords.x;
      const qy = qcoords.y;
      midpoint.x += qx;
      midpoint.y += qy;
    }

    return midpoint;
  }

  get x() {
    return this.getCenterPoint().x;
  }
  get y() {
    return this.getCenterPoint().y;
  }

  setQuadraticByPosition(x, y)
  {
    const from = this.from;
    const to = this.to;
    const fromx = from.x;
    const fromy = from.y;
    const tox = to.x;
    const toy = to.y;

    let dx = tox - fromx;
    let dy = toy - fromy;
    const midpointx = fromx + dx / 2;
    const midpointy = fromy + dy / 2;

    //Remember: y-axis is flipped because canvas coord-space is -y => +y
    //Therefore, dy needs to be flipped
    const angleOffset = Math.atan2(-dy, dx);
    dx = x - midpointx;
    dy = y - midpointy;

    const PI = Math.PI;
    const PI2 = PI * 2;
    const HALFPI = PI / 2;
    //0 rad = to the right
    //Also: angleOffset is the offset from midpoint angle, the orthogonal base vector
    //This is because the from and to could be flipped, and
    //therefore give a negative, or at least a reversed angle.
    let radians = Math.atan2(dy, dx) + angleOffset;
    let length = Math.sqrt(dx * dx + dy * dy);
    if (length < 0) length = 0;

    const outrad = radians - (-HALFPI);//-PI / 2 is outward
    const inrad = radians - (HALFPI);//PI / 2 is inward
    //TODO: Should be dependent on length
    const maxdr = PI / 20;

    if (Math.abs(length) < 8)
    {
      radians = 0;
      length = 0;
    }
    else if (outrad < maxdr && outrad > -maxdr)
    {
      radians = -HALFPI;//-PI / 2 is outward
    }
    else if (-inrad < maxdr && -inrad > -maxdr)
    {
      radians = HALFPI;//PI / 2 is inward
    }

    this._quad.radians = radians;
    this._quad.length = length;
  }

  setLabel(label)
  {
    const prevLabel = this._label;
    this._label = label;

    if (prevLabel != label)
    {
      this.graph.emit("edgeLabel", this, label, prevLabel);

      this.graph.markDirty();
    }
  }

  get label() { return this._label; }
  set label(value) {
    //TODO: Deprecate this
    throw new Error("This is deprecated; please use setLabel!");
  }

  get to() { return this._to; }
  set to(value) {
    let prevDst = this._to;
    this._to = value;

    //Default
    this._quad.length = Config.PLACEHOLDER_LENGTH;

    if (prevDst !== this._to)
    {
      this.graph.emit("edgeDestination", this, this._to, prevDst);
      this.graph.markDirty();
    }
  }

  makeSelfLoop(angle=(Math.PI / 2))
  {
    //If not already a self loop, make it so.
    if (this.from !== this.to)
    {
      this.to = this.from;
      //TODO: this should be done automatically?
      //throw new Error("Must already be a self loop to makeSelfLoop");
    }

    const from = this.from;
    const to = this.to;
    const fromx = from.x;
    const fromy = from.y;
    const tox = to.x;
    const toy = to.y;

    let dx = tox - fromx;
    let dy = toy - fromy;
    const midpointx = fromx + dx / 2;
    const midpointy = fromy + dy / 2;

    this.setQuadraticByPosition(midpointx - Math.cos(angle) * Config.SELF_LOOP_HEIGHT,
      midpointy - Math.sin(angle) * Config.SELF_LOOP_HEIGHT);
  }

  makePlaceholder()
  {
    const prev = this.to;

    //If not already a placeholder, make it so.
    if (this.to !== null)
    {
      this.to = null;
      //TODO: this should be done automatically?
      //throw new Error("Must already be a placeholder to makePlaceholder");
    }

    //Quad is re-used to determine edge angle for placeholder
    //This is used specifically for quad since regular quad is
    //dependent on this.to != null
    if (prev)
    {
      const dx = prev ? this.from.x - prev.x : -1;
      const dy = prev ? this.from.y - prev.y : 0;
      const angle = -Math.atan2(dx, dy) - (Math.PI / 2);
      this._quad.radians = angle;
    }
    else
    {
      this._quad.radians = 0;
    }
  }

  isQuadratic()
  {
    return !this.isPlaceholder() && this._quad.length != 0;
  }
}

function toQuadVector(edge, qx, qy, dst)
{
  //Calculate the quad vector from passed-in quad coords
  if (edge.from == null || edge._to == null) return null;
  const from = edge.from;
  const to = edge.to;
  const fromx = from.x;
  const fromy = from.y;
  const tox = to.x;
  const toy = to.y;
  const dx = tox - fromx;
  const dy = toy - fromy;
  const midpointx = fromx + dx / 2;
  const midpointy = fromy + dy / 2;
  const angle = Math.atan2(dy, dx);
  const radians = Math.atan2(qy, qx);
  dst.radians = radians - angle;
  dst.length = Math.sqrt(qx * qx + qy * qy);
  return dst;
}

function toQuadCoords(edge, radians, length, dst)
{
  //Calculate the quad coords from passed-in quad vector
  if (edge.from == null || edge._to == null) return;
  const from = edge.from;
  const to = edge._to;
  getDirectionalVector(from.x, from.y, to.x, to.y,
    length, radians, dst);
  return dst;
}

function getDirectionalVector(x1, y1, x2, y2, dist, angleOffset=0, dst={})
{
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx) + angleOffset;
  dst.x = Math.cos(angle) * dist;
  dst.y = Math.sin(angle) * dist;
  return dst;
}

function getMidPoint(x1, y1, x2, y2, dst={})
{
  dst.x = x1 + (x2 - x1) / 2;
  dst.y = y1 + (y2 - y1) / 2;
  return dst;
}

export default Edge;
