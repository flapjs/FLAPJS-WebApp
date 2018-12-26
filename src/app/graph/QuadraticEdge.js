import GraphEdge from 'graph/GraphEdge.js';

class GraphCurvedEdge extends GraphEdge
{
  constructor(id, from, to=null)
  {
    super(id, from, null);

    //radians = the angle in radians, where 0 is the normal of midpoint
    //length = the distance from midpoint
    this._quad = {
      radians: 0,
      length: 0,
      _coords: {x: 0, y: 0}
    };

    //Make sure to format it correctly when creating...
    this.changeDestinationNode(to);
  }

  setQuadratic(radians, length=undefined)
  {
    this._quad.radians = radians;
    if (typeof length === 'number')
    {
      this._quad.length = length;
    }
    return this;
  }

  getQuadratic()
  {
    return this._quad;
  }

  isQuadratic()
  {
    return !this.isPlaceholder() && this._quad.length != 0;
  }

  setQuadraticByCoords(x, y)
  {
    const from = this._from;
    const to = this._to;
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

  getQuadraticAsCoords()
  {
    const from = this._from;
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
      //To mark dirty...
      _capture: {
        fx: 0, fy: 0,
        tx: 0, ty: 0,
        ql: 0, qr: 0
      }
      */
      getDirectionalVector(from.x, from.y, to.x, to.y, this._quad.length, this._quad.radians, dst);
    }
    return dst;
  }

  getSelfLoopHeight()
  {
    return this._from.getNodeSize();
  }

  formatAsSelfLoop()
  {
    this.setQuadratic(-Math.PI / 2, this._from.getNodeSize() + this.getSelfLoopHeight());
  }

  formatAsPlaceholder(prevDest)
  {
    //Quad is re-used to determine edge angle for placeholder
    //This can be used specifically for quad since regular quad is
    //dependent on this._to != null, which placeholder assumes this._to == null.
    //Also, quad.length is ignored, because the length should always be
    //getPlaceholderLength(). This is resolved by getStartPoint(), etc.
    if (prevDest)
    {
      const dx = this._from.x - prevDest.x;
      const dy = this._from.y - prevDest.y;
      const angle = -Math.atan2(dx, dy) - (Math.PI / 2);
      this._quad.radians = angle;
    }
    else
    {
      this._quad.radians = 0;
    }
  }

  //Override
  changeDestinationNode(node)
  {
    const prevDest = this._to;

    //Just to optimize this a little :)
    if (prevDest === node) return;

    super.changeDestinationNode(node);

    if (this.isPlaceholder())
    {
      this.formatAsPlaceholder(prevDest);
    }
    else if (this.isSelfLoop())
    {
      this.formatAsSelfLoop();
    }
  }

  //Override
  getEdgeDirection()
  {
    let result = 0;
    if (this.isQuadratic())
    {
      const coords = this.getQuadraticAsCoords();
      result = Math.atan2(coords.y, coords.x) + Math.PI / 2;
    }
    else
    {
      result = super.getEdgeDirection();
    }

    return result;
  }

  //Override
  getStartPoint(dst={x: 0, y: 0})
  {
    const from = this._from;
    const to = this._to;

    if (!from) throw new Error("Source of edge cannot be null.");
    if (!to)
    {
      //Make sure to use quad for placeholder direction (not magnitude)
      const px = Math.cos(this._quad.radians);
      const py = Math.sin(this._quad.radians);
      const nodeSize = from.getNodeSize();
      dst.x = from.x + px * nodeSize;
      dst.y = from.y + py * nodeSize;
      return dst;
    }

    //Check if edge is following something other than a node...then remain flat
    if (!to.getNodeSize || !this.isQuadratic())
    {
      getDirectionalVector(from.x, from.y, to.x, to.y, from.getNodeSize(), 0, dst);
      dst.x += from.x;
      dst.y += from.y;
      return dst;
    }
    else
    {
      getMidPoint(from.x, from.y, to.x, to.y, dst);
      const qcoords = this.getQuadraticAsCoords();
      const qx = dst.x + qcoords.x;
      const qy = dst.y + qcoords.y;
      getDirectionalVector(from.x, from.y, qx, qy, from.getNodeSize(), this.isSelfLoop() ? (Math.PI / 4) : 0, dst);
      dst.x += from.x;
      dst.y += from.y;
      return dst;
    }
  }

  //Override
  getEndPoint(dst={x: 0, y: 0})
  {
    const from = this._from;
    const to = this._to;

    if (!from) throw new Error("Source of edge cannot be null.");
    if (!to)
    {
      //Make sure to use quadCoords for placeholder direction (not magnitude)
      const px = Math.cos(this._quad.radians);
      const py = Math.sin(this._quad.radians);
      const placeholderLength = from.getNodeSize() + this.getPlaceholderLength();
      dst.x = from.x + px * placeholderLength;
      dst.y = from.y + py * placeholderLength;
      return dst;
    }

    //Get end point for non-nodes...
    if (!to.getNodeSize)
    {
      return to;
    }
    //Get end point for straight edges...
    else if (!this.isQuadratic())
    {
      getDirectionalVector(to.x, to.y, from.x, from.y, to.getNodeSize(), 0, dst);
      dst.x += to.x;
      dst.y += to.y;
      return dst;
    }
    //Get end point for quadratics...
    else
    {
      getMidPoint(from.x, from.y, to.x, to.y, dst);
      const qcoords = this.getQuadraticAsCoords();
      const qx = dst.x + qcoords.x;
      const qy = dst.y + qcoords.y;
      getDirectionalVector(to.x, to.y, qx, qy, to.getNodeSize(), this.isSelfLoop() ? -(Math.PI / 4.0) : 0, dst);
      dst.x += to.x;
      dst.y += to.y;
      return dst;
    }
  }

  //Override
  getCenterPoint(dst={x: 0, y: 0})
  {
    const from = this._from;
    const to = this._to;

    if (!from) throw new Error("Source of edge cannot be null.");
    if (!to)
    {
      //Make sure to use quad for placeholder direction (not magnitude)
      const px = Math.cos(this._quad.radians);
      const py = Math.sin(this._quad.radians);
      const placeholderLength = from.getNodeSize() + this.getPlaceholderLength() / 2;
      dst.x = from.x + px * placeholderLength;
      dst.y = from.y + py * placeholderLength;
      return dst;
    }

    getMidPoint(from.x, from.y, to.x, to.y, dst);

    if (this.isQuadratic())
    {
      const qcoords = this.getQuadraticAsCoords();
      dst.x += qcoords.x;
      dst.y += qcoords.y;
    }

    return dst;
  }

  //Override
  getHashString(usePosition=true)
  {
    if (usePosition)
    {
      return super.getHashString(usePosition) + ":" + this._quad.radians + "," + this._quad.length;
    }
    else
    {
      return super.getHashString(usePosition);
    }
  }
}

function getDirectionalVector(x1, y1, x2, y2, dist, angleOffset=0, dst={x: 0, y: 0})
{
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx) + angleOffset;
  dst.x = Math.cos(angle) * dist;
  dst.y = Math.sin(angle) * dist;
  return dst;
}

function getMidPoint(x1, y1, x2, y2, dst={x: 0, y: 0})
{
  dst.x = x1 + (x2 - x1) / 2;
  dst.y = y1 + (y2 - y1) / 2;
  return dst;
}

export default GraphCurvedEdge;
