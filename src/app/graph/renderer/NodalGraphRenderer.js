import React from 'react';

import GraphNodeRenderer from './GraphNodeRenderer.js';
import GraphEdgeRenderer, {ARROW_DIRECTED} from './GraphEdgeRenderer.js';

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

    return (
      <g>
        {graph.getNodes().map(
          (e, i) => <GraphNodeRenderer key={e.getGraphElementID() || i}
          node={e}/>)}
        {graph.getEdges().map(
          (e, i) => <GraphEdgeRenderer key={e.getGraphElementID() || i}
          edge={e}
          quadratic={e instanceof QuadraticEdge}
          arrow={ARROW_DIRECTED}/>)}
      </g>
    );
  }
}

export default NodalGraphRenderer;
