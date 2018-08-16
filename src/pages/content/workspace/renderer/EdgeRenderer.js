import React from 'react';

import Config from 'config.js';

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
    const quadCoords = edge.getQuadCoords();

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
      const cx = center.x + quadCoords.x;//(midpoint + the quadratic offset) + the quadratic offset
      const cy = center.y + quadCoords.y;//(midpoint + the quadratic offset) + the quadratic offset
      arrowAngle = Math.atan2(cx - end.x, cy - end.y) + Math.PI;
      quadLine = "Q " + cx + " " + cy + " " + end.x + " " + end.y;
    }

    //Draw multiple labels
    const labels = label.split(",");
    let dy = 0;

    return <g className="graph-edge-container">
      //Draw lines
      <path className="graph-edge"
        d={
          "M " + start.x + " " + start.y + " " +
          quadLine + " " +
          "M " +
            (end.x - (Config.ARROW_WIDTH * Math.sin(arrowAngle - SIXTH_PI))) + " " +
            (end.y - (Config.ARROW_WIDTH * Math.cos(arrowAngle - SIXTH_PI))) + " " +
          "L " + end.x + " " + end.y + " " +
          "L " +
            (end.x - (Config.ARROW_WIDTH * Math.sin(arrowAngle + SIXTH_PI))) + " " +
            (end.y - (Config.ARROW_WIDTH * Math.cos(arrowAngle + SIXTH_PI)))}
        fill="none"

        stroke="#000000"/>

      {/*Draw labels*/}
      { labels.length > 0 && labels.map((str, i) => {
          const cx = (center && center.x || 0);
          const cy = (center && center.y || 0);
          const signy = (quadCoords && Math.sign(quadCoords.y)) || -1;
          const xx = cx;
          const yy = cy + ((i + 1) * signy * 15);

          //TODO: ctx.clearRect(xx - cx - 2, yy - 5, (cx * 2) + 4, 10);
          return <text
            key={i}
            className="graph-edge-label"
            x={xx} y={yy}
            alignmentBaseline="central"
            pointerEvents="none"
            style={{userSelect: "none"}}

            fontFamily="\'Overpass Mono\', monospace"
            textAnchor="middle">
            {str}
          </text>;
      })}
    </g>;
  }
}

export default EdgeRenderer;
