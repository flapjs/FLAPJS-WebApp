import React from 'react';

class GraphEdge extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      to: null,
      quad: {x: 0, y: 0},
      label: "q0",
      cursor: {
        move: false,
        _mousemove: null,
        _mouseup: null,
      }
    };
  }

  getStartPoint()
  {
    const from = this.props.from;
    const to = this.state.to;
    const quadx = this.state.quad.x;
    const quady = this.state.quad.y;
    const radius = from.props.radius;

    if (!from) throw new Error("Source of edge cannot be null.");
    if (!to)
    {
      if (this.props.proxy)
      {
        const dir = getDirectionalVector(from.state.x, from.state.y,
          from.state.pointer.x, from.state.pointer.y, radius, 0);

        //Reuse created object for result...
        dir.x = from.state.x + dir.x;
        dir.y = from.state.y + dir.y;
        return dir;
      }
      else
      {
        //TODO: Make sure to use quad for placeholder direction (not magnitude)
        return {
          x: from.state.x + quadx * radius,
          y: from.state.y + quady * radius
        };
      }
    }

    const fromx = from.state.x;
    const fromy = from.state.y;
    const tox = to.state.x;
    const toy = to.state.y;

    const selfLoop = from == to;

    if (quadx == 0 && quady == 0)
    {
      const dir = getDirectionalVector(fromx, fromy, tox, toy, radius, 0);

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

      const dir = getDirectionalVector(fromx, fromy, qx, qy, radius,
        selfLoop ? (Math.PI / 4) : 0);

      //Reuse created object for result...
      dir.x = fromx + dir.x;
      dir.y = fromy + dir.y;
      return dir;
    }
  }

  getEndPoint()
  {
    const from = this.props.from;
    const to = this.state.to;
    const quadx = this.state.quad.x;
    const quady = this.state.quad.y;
    const radius = from.props.radius;
    const placeholderLength = 1;

    if (!from) throw new Error("Source of edge cannot be null.");
    if (!to)
    {
      if (from.state.proxyEdge == this)
      {
        //If proxyEdge, follow the cursor instead
        return from.state.pointer;
      }
      else
      {
        //TODO: Make sure to use quad for placeholder direction (not magnitude)
        return {
          x: from.state.x + quadx * (radius + placeholderLength),
          y: from.state.y + quady * (radius + placeholderLength)
        };
      }
    }

    const fromx = from.state.x;
    const fromy = from.state.y;
    const tox = to.state.x;
    const toy = to.state.y;

    const selfLoop = from == to;

    //Get end point for straight edges...
    if (quadx == 0 && quady == 0)
    {
      const dir = getDirectionalVector(fromx, fromy, tox, toy, radius, 0);

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

      const dir = getDirectionalVector(qx, qy, tox, toy, radius,
        selfLoop ? -(Math.PI / 4) : 0);

      //Reuse created object for result...
      dir.x = tox - dir.x;
      dir.y = toy - dir.y;
      return dir;
    }
  }

  getCenterPoint()
  {
    const from = this.props.from;
    const to = this.state.to;
    const quadx = this.state.quad.x;
    const quady = this.state.quad.y;
    const radius = from.props.radius;
    const placeholderLength = 1;

    if (!from) throw new Error("Source of edge cannot be null.");
    if (!to)
    {
      if (from.state.proxyEdge == this)
      {
        //If proxyEdge, follow the cursor instead
        const midpoint = getMidPoint(from.state.x, from.state.y, from.state.pointer.x, from.state.pointer.y);
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
          x: from.state.x + quadx * (radius + placeholderLength / 2),
          y: from.state.y + quady * (radius + placeholderLength / 2)
        };
      }
    }

    const fromx = from.state.x;
    const fromy = from.state.y;
    const tox = to.state.x;
    const toy = to.state.y;

    const midpoint = getMidPoint(fromx, fromy, tox, toy);
    if (quadx != 0 || quady != 0)
    {
      midpoint.x += quadx;
      midpoint.y += quady;
    }
    return midpoint;
  }

  render()
  {
    const from = this.props.from;
    const start = this.getStartPoint();
    const end = this.getEndPoint();
    return <g className="graph-edge">
      {this.renderLine(start, from.state.pointer, null)}
    </g>;
    /*
    const from = this.props.from;
    const to = this.state.to;
    const quad = this.state.quad;
    const radius = from.props.radius;

    if (!from) throw new Error("Source of edge cannot be null.");

    const label = this.state.label;

    const start = this.getStartPoint();
    const end = this.getEndPoint();

    return <g className="graph-edge">
      {this.renderLine(start, end, quad)}

      //Label
      <text
        x={start.x}
        y={start.y}
        dy="0.3em"
        textAnchor="middle">
        {label}
      </text>
    </g>;
    */
  }

  renderLine(start, end, quad)
  {
    //TODO: this should be calculated in GraphEdgeArrow
    let arrowAngle = 0;

    //Calculate curved lines...
    let quadLine = null;
    if (!quad || (quad.x == 0 && quad.y == 0))
    {
      //Straight line
      arrowAngle = Math.atan2(start.x - end.x, start.y - end.y) + Math.PI;
      quadLine = "L " + end.x + " " + end.y;
    }
    else
    {
      //Quadratic curve
      const centerQuad = this.getCenterPoint();
      centerQuad.x += quad.x;
      centerQuad.y += quad.y;
      arrowAngle = Math.atan2(centerQuad.x - end.x, centerQuad.y - end.y) + Math.PI;
      quadLine = "Q " + centerQuad.x + " " + centerQuad.y + " " + end.x + " " + end.y;
    }
    return <path d={"M " + start.x + " " + start.y + " " + quadLine}
      fill="none"/>
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

export default GraphEdge;
