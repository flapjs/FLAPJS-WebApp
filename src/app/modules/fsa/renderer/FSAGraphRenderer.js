import React from 'react';

import NodeRenderer from './NodeRenderer.js';
import EdgeRenderer from './EdgeRenderer.js';
import InitialMarkerRenderer from './InitialMarkerRenderer.js';

class FSAGraphRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    //Inherits props from parent
    const app = this.props.app;
    const inputController = app.getInputController();
    const graphController = app.getGraphController();
    const graph = graphController.getGraph();

    return <g>
      {/* Nodes */}
      {graph.getNodes().map((e, i) => <NodeRenderer key={e.getGraphElementID() || i} node={e}/>)}

      {/* Edges */}
      {graph.getEdges().map((e, i) => <EdgeRenderer key={e.getGraphElementID() || i} edge={e}/>)}

      {/* Initial marker and ghost */}
      { graph.getStartNode() && (inputController.ghostInitialMarker == null ?
        <InitialMarkerRenderer node={graph.getStartNode()}/> :
        <InitialMarkerRenderer node={inputController.ghostInitialMarker}/>) }
    </g>;
  }
}

export default FSAGraphRenderer;
