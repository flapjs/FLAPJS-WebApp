import React from 'react';

import GraphNode from './GraphNode.js';
import GraphEdge from './GraphEdge.js';
import InitialMarkerRenderer from './InitialMarkerRenderer.js';

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

    return <g>
      //States
      { graph.nodes.map((e, i) =>
        <GraphNode key={i} node={e} />) }
      //Edges
      { graph.edges.map((e, i) =>
        <GraphEdge key={i} edge={e}
          start={e.getStartPoint()}
          end={e.getEndPoint()}
          center={e.getCenterPoint()}
          label={e.label}/>) }
    </g>;
  }
}

export default GraphRenderer;
