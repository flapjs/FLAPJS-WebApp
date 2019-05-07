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

        const nodes = [];
        for(const node of this.props.nodes)
        {
            nodes.push(
                <GraphNodeRenderer
                    key={node.getGraphElementID()}
                    node={node}
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