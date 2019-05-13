import React from 'react';

import GraphNodeRenderer from '../../renderer/GraphNodeRenderer.js';

class GraphNodeLayer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const inputController = this.props.inputController;
        const onMouseOver = this.props.onMouseOver;
        const onMouseOut = this.props.onMouseOut;
        const NodeRenderer = this.props.nodeRenderer || GraphNodeRenderer;

        const nodes = [];
        for(const node of this.props.nodes)
        {
            nodes.push(
                <NodeRenderer
                    key={node.getGraphElementID()}
                    node={node}
                    fill={'var(--color-graph-node)'}
                    stroke={'var(--color-graph-text)'}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    pointerEvents={inputController.hasPointerEvents(node) ? 'all' : 'none'} />
            );
        }

        return (
            <g>
                {nodes}
            </g>
        );
    }
}

export default GraphNodeLayer;