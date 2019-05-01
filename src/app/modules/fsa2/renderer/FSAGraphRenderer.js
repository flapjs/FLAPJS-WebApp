import React from 'react';
import './FSAGraphRenderer.css';

import FSANodeRenderer from './FSANodeRenderer.js';
import FSAEdgeRenderer from './FSAEdgeRenderer.js';
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
        const currentModule = this.props.currentModule;
        const inputController = currentModule.getInputController();
        const graphController = currentModule.getGraphController();
        const graph = graphController.getGraph();

        //Graph origin crosshair
        return (
            <g>
                {!graph.isEmpty() &&
                    <React.Fragment>
                        <line className="graph-ui" x1="0" y1="-5" x2="0" y2="5" stroke="var(--color-viewport-back-detail)" />
                        <line className="graph-ui" x1="-5" y1="0" x2="5" y2="0" stroke="var(--color-viewport-back-detail)" />
                    </React.Fragment>}

                {graph.getNodes().map((e, i) => <FSANodeRenderer key={e.getGraphElementID() || i} node={e} />)}
                {graph.getEdges().map((e, i) => <FSAEdgeRenderer key={e.getGraphElementID() || i} edge={e} />)}

                {/* Initial marker and ghost */}
                {graph.getStartNode() && (inputController.getInputHandlers()[3].ghostInitialMarker == null ?
                    <InitialMarkerRenderer node={graph.getStartNode()} /> :
                    <InitialMarkerRenderer node={inputController.getInputHandlers()[3].ghostInitialMarker} />)}
            </g>
        );
    }
}

export default FSAGraphRenderer;
