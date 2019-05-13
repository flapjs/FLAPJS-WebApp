import React from 'react';

import GraphEdgeRenderer from '../../renderer/GraphEdgeRenderer.js';

class GraphEdgeLayer extends React.Component
{
    constructor(props) { super(props); }

    /** @override */
    render()
    {
        const inputController = this.props.inputController;
        const onMouseOver = this.props.onMouseOver;
        const onMouseOut = this.props.onMouseOut;
        const EdgeRenderer = this.props.edgeRenderer || GraphEdgeRenderer;
		
        const edges = [];
        for(const edge of this.props.edges)
        {
            edges.push(
                <EdgeRenderer
                    key={edge.getGraphElementID()}
                    edge={edge}
                    stroke={'var(--color-graph-text)'}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    pointerEvents={inputController.hasPointerEvents(edge) ? 'all' : 'none'} />
            );
        }

        return (
            <g>
                {edges}
            </g>
        );
    }
}

export default GraphEdgeLayer;