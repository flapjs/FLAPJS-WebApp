import React from 'react';

import GraphNodeRenderer from './GraphNodeRenderer.js';
import GraphEdgeRenderer from './GraphEdgeRenderer.js';
import QuadraticEdgeRenderer from './QuadraticEdgeRenderer.js';

import GraphEdge from '../GraphEdge.js';
import QuadraticEdge from '../QuadraticEdge.js';

class NodalGraphRenderer extends React.Component
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
    const inputController = currentModule.getInputController();
    const graphController = currentModule.getGraphController();
    const graph = graphController.getGraph();

    const edgeClass = graph.getEdgeClass();
    let EdgeRenderer = null;
    if (edgeClass instanceof GraphEdge)
    {
      EdgeRenderer = GraphEdgeRenderer;
    }
    else if (edgeClass instanceof QuadraticEdge)
    {
      EdgeRenderer = QuadraticEdgeRenderer;
    }
    else
    {
      throw new Error("Missing renderer for unknown edge class");
    }

    return (
      <g>
        {graph.getNodes().map((e, i) => <GraphNodeRenderer key={e.getGraphElementID() || i} node={e}/>)}
        {graph.getEdges().map((e, i) => <EdgeRenderer key={e.getGraphElementID() || i} edge={e}/>)}
      </g>
    );
  }
}

export default NodalGraphRenderer;
