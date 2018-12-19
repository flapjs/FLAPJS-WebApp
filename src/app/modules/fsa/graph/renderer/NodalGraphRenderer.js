import React from 'react';

import NodeRenderer from './NodeRenderer.js';
import EdgeRenderer from './EdgeRenderer.js';
import InitialMarkerRenderer from './InitialMarkerRenderer.js';

class NodalGraphRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    const graph = this.props.graph;
    const inputController = this.props.inputController;
    return <g>
      {/* Nodes */}
      {graph.nodes.map((e, i) => <NodeRenderer key={e.getGraphElementID() || i} node={e}/>)}

      {/* Edges */}
      {graph.edges.map((e, i) => <EdgeRenderer key={e.getGraphElementID() || i} edge={e}/>)}

      {/* Initial marker and ghost */}
      { graph.getStartNode() && (inputController.ghostInitialMarker == null ?
        <InitialMarkerRenderer node={graph.getStartNode()}/> :
        <InitialMarkerRenderer node={inputController.ghostInitialMarker}/>) }
    </g>;
  }
}

export default NodalGraphRenderer;
