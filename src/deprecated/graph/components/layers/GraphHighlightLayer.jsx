import React from 'react';
import PropTypes from 'prop-types';

import GraphHighlightRenderer from '../renderer/GraphHighlightRenderer.jsx';

const HIGHLIGHT_OFFSET = 4;

class GraphHighlightLayer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const highlights = [];

        const nodes = this.props.nodes;
        if (nodes)
        {
            for(const node of nodes)
            {
                highlights.push(
                    <GraphHighlightRenderer
                        key={node.getGraphElementID()}
                        center={node}
                        radius={node.getNodeSize() + HIGHLIGHT_OFFSET}/>
                );
            }
        }

        const edges = this.props.edges;
        if (edges)
        {
            for(const edge of edges)
            {
                highlights.push(
                    <GraphHighlightRenderer
                        key={edge.getGraphElementID()}
                        center={edge.getCenterPoint()}/>
                );
            }
        }

        return (
            <g>
                {highlights}
            </g>
        );
    }
}
GraphHighlightLayer.propTypes = {
    // TODO: Fix types.
    nodes: PropTypes.any,
    edges: PropTypes.any,
};

export default GraphHighlightLayer;
