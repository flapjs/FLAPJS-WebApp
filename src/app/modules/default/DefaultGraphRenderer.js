import React from 'react';

import GraphNodeRenderer from 'graph/renderer/GraphNodeRenderer.js';
import QuadraticEdgeRenderer from 'graph/renderer/QuadraticEdgeRenderer.js';

class HLSMGraphRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    //Inherits props from parent
    const currentModule = this.props.currentModule;
    const graphController = currentModule.getGraphController();
    const graph = graphController.getGraph();

    return <g>
      {graph.getNodes().map((e, i) => <NodeRenderer key={e.getGraphElementID() || i} node={e}/>)}
      {graph.getEdges().map((e, i) => <EdgeRenderer key={e.getGraphElementID() || i} edge={e}/>)}
    </g>;
  }
}

export default HLSMGraphRenderer;
