import React from 'react';
import './PDAGraphRenderer.css';

import PDANodeRenderer from './PDANodeRenderer.js';
import PDAEdgeRenderer from './PDAEdgeRenderer.js';
import InitialMarkerRenderer from './InitialMarkerRenderer.js';

class PDAGraphRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  /** @override */
  render()
  {
    //Inherits props from parent
    const currentModule = this.props.currentModule;
    const inputController = currentModule.getInputController();
    const graphController = currentModule.getGraphController();
    const graph = graphController.getGraph();

    return (
      <g>
        {graph.getNodes().map((e, i) => <PDANodeRenderer key={e.getGraphElementID() || i} node={e}/>)}
        {graph.getEdges().map((e, i) => <PDAEdgeRenderer key={e.getGraphElementID() || i} edge={e}/>)}

        {/* Initial marker and ghost */}
        { graph.getStartNode() && (inputController.getInputHandlers()[3].ghostInitialMarker == null ?
          <InitialMarkerRenderer node={graph.getStartNode()}/> :
          <InitialMarkerRenderer node={inputController.getInputHandlers()[3].ghostInitialMarker}/>) }
      </g>
    );
  }
}

export default PDAGraphRenderer;
