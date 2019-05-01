import React from 'react';

import Config from 'deprecated/config.js';

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
        const start = edge.getStartPoint();
        const end = edge.getEndPoint();
        const center = edge.getCenterPoint();
        const label = edge.getEdgeLabel();
        const quad = edge.getQuadratic();
        const quadCoords = edge.getQuadraticAsCoords();
        const edgeDir = edge.getEdgeDirection();
        const flipLabel = quadCoords.y > 0;

        //Calculate curved lines...
        let quadLine = null;
        if (!edge.isQuadratic())
        {
            //Straight line
            arrowAngle = Math.atan2(start.x - end.x, start.y - end.y) + Math.PI;
            quadLine = 'L ' + end.x + ' ' + end.y;
        }
        else
        {
            //Quadratic curve
            //center = (midpoint + the quadratic offset) + the quadratic offset
            const cx = center.x + quadCoords.x;
            const cy = center.y + quadCoords.y;
            arrowAngle = Math.atan2(cx - end.x, cy - end.y) + Math.PI;
            quadLine = 'Q ' + cx + ' ' + cy + ' ' + end.x + ' ' + end.y;
        }

        //Draw multiple labels
        const labels = edge.getEdgeSymbolsFromLabel();
        let dy = 0;

        const cx = (center && center.x || 0);
        const cy = (center && center.y || 0);

        return <g className="graph-edge-container">
      //Draw lines
            <path className="graph-edge" id={'edge:' + edge.getGraphElementID()}
                d={
                    'M ' + start.x + ' ' + start.y + ' ' +
          quadLine + ' ' +
          'M ' +
            (end.x - (Config.ARROW_WIDTH * Math.sin(arrowAngle - SIXTH_PI))) + ' ' +
            (end.y - (Config.ARROW_WIDTH * Math.cos(arrowAngle - SIXTH_PI))) + ' ' +
          'L ' + end.x + ' ' + end.y + ' ' +
          'L ' +
            (end.x - (Config.ARROW_WIDTH * Math.sin(arrowAngle + SIXTH_PI))) + ' ' +
            (end.y - (Config.ARROW_WIDTH * Math.cos(arrowAngle + SIXTH_PI)))}
                fill="none"

                stroke="#000000"/>

            {/*Draw labels*/}
            <g transform={'translate(' + (cx) + ',' + (cy) + ') rotate(' + (edgeDir * 180 / Math.PI) + ')'}>
                { labels.length > 0 && labels.map((str, i) => 
                {
                    const yy = (i + 1) * -15;

                    //TODO: ctx.clearRect(xx - cx - 2, yy - 5, (cx * 2) + 4, 10);
                    return <text
                        key={str + '.' + i}
                        className="graph-edge-label"
                        transform={'translate(0, ' + yy + ')' + (flipLabel ? ' scale(-1, -1)' : '')}
                        alignmentBaseline="central"
                        pointerEvents="none"
                        style={{userSelect: 'none'}}
                        textAnchor="middle">
                        {str}
                    </text>;
                })}
            </g>
        </g>;
    }
}

export default EdgeRenderer;
