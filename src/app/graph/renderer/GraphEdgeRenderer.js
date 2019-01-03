import React from 'react';

const GRAPH_EDGE_CONTAINER_STYLE_NAME = "graph-edge-container";
const GRAPH_EDGE_BODY_STYLE_NAME = "graph-edge";
const GRAPH_EDGE_LABEL_STYLE_NAME = "graph-edge-label";

const ARROW_WIDTH = 10;
const SIXTH_PI = Math.PI / 6;

class GraphEdgeRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    const stroke = this.props.stroke || "#000000";

    const edge = this.props.edge;
    const start = edge.getStartPoint();
    const end = edge.getEndPoint();
    const center = edge.getCenterPoint();
    const label = edge.getEdgeLabel();
    const edgeDir = edge.getEdgeDirection();

    //Straight line
    let arrowAngle = Math.atan2(start.x - end.x, start.y - end.y) + Math.PI;
    let quadLine = "L " + end.x + " " + end.y;

    //Draw multiple labels
    const labels = label.split('\n');
    let dy = 0;

    const cx = (center && center.x || 0);
    const cy = (center && center.y || 0);

    return (
      <g className={GRAPH_EDGE_CONTAINER_STYLE_NAME}>
        //Draw lines
        <path className={GRAPH_EDGE_BODY_STYLE_NAME} id={"edge:" + edge.getGraphElementID()}
          d={
            "M " + start.x + " " + start.y + " " +
            quadLine + " " +
            "M " +
              (end.x - (ARROW_WIDTH * Math.sin(arrowAngle - SIXTH_PI))) + " " +
              (end.y - (ARROW_WIDTH * Math.cos(arrowAngle - SIXTH_PI))) + " " +
            "L " + end.x + " " + end.y + " " +
            "L " +
              (end.x - (ARROW_WIDTH * Math.sin(arrowAngle + SIXTH_PI))) + " " +
              (end.y - (ARROW_WIDTH * Math.cos(arrowAngle + SIXTH_PI)))}
          fill="none"

          stroke={stroke}/>

        {/*Draw labels*/}
        <g transform={"translate(" + (cx) + "," + (cy) + ") rotate(" + (edgeDir * 180 / Math.PI) + ")"}>
        { labels.length > 0 && labels.map((str, i) => {
            const yy = (i + 1) * -15;

            //TODO: ctx.clearRect(xx - cx - 2, yy - 5, (cx * 2) + 4, 10);
            return <text
              key={str + "." + i}
              className={GRAPH_EDGE_LABEL_STYLE_NAME}
              transform={"translate(0, " + yy + ")"}
              alignmentBaseline="central"
              pointerEvents="none"
              style={{userSelect: "none"}}
              textAnchor="middle">
              {str}
            </text>;
        })}
        </g>
      </g>
    );
  }
}

export default GraphEdgeRenderer;
