import React from 'react';

import * as Config from 'config.js';

import Node from 'graph/Node.js';

class GraphEdge extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    const SIXTH_PI = Math.PI / 6;
    const edge = this.props.edge;

    const from = edge.from;
    const to = edge.to;
    const quad = edge.quad;
    const label = edge.label;

    let arrowAngle = 0;

    const start = edge.getStartPoint();
    const end = edge.getEndPoint();
    const center = edge.getCenterPoint();

    //Calculate curved lines...
    let quadLine = null;
    if (quad == null)
    {
      //Straight line
      arrowAngle = Math.atan2(start.x - end.x, start.y - end.y) + Math.PI;
      quadLine = "L " + end.x + " " + end.y;
    }
    else
    {
      //Quadratic curve
      arrowAngle = Math.atan2(center.x - end.x, center.y - end.y) + Math.PI;
      quadLine = "Q " + center.x + " " + center.y + " " + end.x + " " + end.y;
    }

    //Draw multiple labels
    const labels = label.split(" ");
    let dy = 0;

    return <g>
      //Draw lines
      <path d={
        "M " + start.x + " " + start.y + " " +
        quadLine + " " +
        "M " +
          (end.x - (Config.ARROW_WIDTH * Math.sin(arrowAngle - SIXTH_PI))) + " " +
          (end.y - (Config.ARROW_WIDTH * Math.cos(arrowAngle - SIXTH_PI))) + " " +
        "L " + end.x + " " + end.y + " " +
        "L " +
          (end.x - (Config.ARROW_WIDTH * Math.sin(arrowAngle + SIXTH_PI))) + " " +
          (end.y - (Config.ARROW_WIDTH * Math.cos(arrowAngle + SIXTH_PI)))}
        stroke={Config.EDGE_STROKE_STYLE}
        fill="none" />

      //Draw labels
      { labels.length > 0 && labels.map((str, i) => {
          const sign = Math.sign(quad.y);
          const xx = center.x;
          const yy = center.y + (8 * Math.sign(quad.y)) + dy * (-sign || 1);
          dy -= 12;

          //TODO: ctx.clearRect(xx - cx - 2, yy - 5, (cx * 2) + 4, 10);
          return <text
            key={i}
            x={xx} y={yy + 4}
            font={Config.EDGE_FONT}
            textAnchor={Config.EDGE_TEXT_ANCHOR}>
            {str}
          </text>;
      })}
    </g>;
  }
}

export default GraphEdge;
