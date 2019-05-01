import React from 'react';

import GraphNodeRenderer from './GraphNodeRenderer.js';
import GraphEdgeRenderer from './GraphEdgeRenderer.js';

class NodalGraphRenderer extends React.Component
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
        const graphController = currentModule.getGraphController();
        const graph = graphController.getGraph();

        return (
            <g>
                {graph.getNodes().map(
                    (e, i) => <GraphNodeRenderer key={e.getGraphElementID() || i}
                        node={e} />)}
                {graph.getEdges().map(
                    (e, i) => <GraphEdgeRenderer key={e.getGraphElementID() || i}
                        edge={e} />)}
            </g>
        );
    }
}

export default NodalGraphRenderer;
