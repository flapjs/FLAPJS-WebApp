import React from 'react';

import GraphNode from './GraphNode.js';
import GraphEdge from './GraphEdge.js';

import * as Config from 'config.js';

var hoverAngle = 0;
class GraphRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    const graph = this.props.graph;
    const pointer = this.props.pointer;

    return (
      <g>
        //States
        { graph.nodes.map((e, i) => <GraphNode key={i} node={e} />) }
        //Edges
        { graph.edges.map((e, i) =>
            <GraphEdge key={i} edge={e}
              start={e.getStartPoint()}
              end={e.getEndPoint()}
              center={e.getCenterPoint()}
              label={e.label}/>) }

        //Initial marker
        { graph.getStartNode() != null &&
          <InitialMarker node={graph.getStartNode()} />}
      </g>
    );
  }
}

function InitialMarker(props)
{
  const x = props.node.x;
  const y = props.node.y;
  return <g>
    <path d={
      "M" + (x - Config.NODE_RADIUS) + " " + (y) +
      " L" + (x - Config.NODE_DIAMETER) + " " + (y - Config.NODE_RADIUS) +
      " L" + (x - Config.NODE_DIAMETER) + " " + (y + Config.NODE_RADIUS) +
      " Z"}
      stroke={Config.EDGE_STROKE_STYLE}
      fill="none" />
  </g>;
}

export default GraphRenderer;
