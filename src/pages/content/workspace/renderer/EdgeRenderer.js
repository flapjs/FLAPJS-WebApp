import React from 'react';

import * as Config from 'config.js';

import Node from 'graph/Node.js';

class EdgeRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    const SIXTH_PI = Math.PI / 6;

    let arrowAngle = 0;
    const edge = this.props.edge;
    const start = this.props.start;
    const end = this.props.end;
    const center = this.props.center;
    const label = this.props.label;

    //Calculate curved lines...
    let quadLine = null;
    if (!edge.isQuadratic())
    {
      //Straight line
      arrowAngle = Math.atan2(start.x - end.x, start.y - end.y) + Math.PI;
      quadLine = "L " + end.x + " " + end.y;
    }
    else
    {
      //Quadratic curve
      const cx = center.x + edge.quad.x;//midpoint + the quadratic offset * 2
      const cy = center.y + edge.quad.y;//midpoint + the quadratic offset * 2
      arrowAngle = Math.atan2(cx - end.x, cy - end.y) + Math.PI;
      quadLine = "Q " + cx + " " + cy + " " + end.x + " " + end.y;
    }

    //Draw multiple labels
    const labels = label.split(",");
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
          const cx = (center && center.x || 0);
          const cy = (center && center.y || 0);
          const signy = Math.sign(edge.quad.y) || -1;
          const xx = cx;
          const yy = cy + ((i + 1) * signy * 15);

          //TODO: ctx.clearRect(xx - cx - 2, yy - 5, (cx * 2) + 4, 10);
          return <text
            key={i}
            x={xx} y={yy}
            font={Config.EDGE_FONT}
            alignmentBaseline="central"
            textAnchor={Config.EDGE_TEXT_ANCHOR}
            fill={Config.EDGE_TEXT_FILL_STYLE}
            pointerEvents="none">
            {str}
          </text>;
      })}
    </g>;
  }
}

export default EdgeRenderer;
