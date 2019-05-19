import React from 'react';

import GraphNodeRenderer from 'graph2/renderer/GraphNodeRenderer.js';
import GraphNodeInputHandler from 'graph2/inputhandler/GraphNodeInputHandler.js';

class GraphNodeLayer extends React.Component
{
    constructor(props)
    {
        super(props);

        const inputController = props.inputController;
        const graphController = props.graphController;

        this._graphNodeInputHandler = new GraphNodeInputHandler(inputController, graphController);
    }

    /** @override */
    componentDidMount()
    {
        const inputContext = this.props.inputContext;
        if (inputContext)
        {
            const inputPriority = this.props.inputPriority || -1;
            inputContext.addInputHandler(this._graphNodeInputHandler, inputPriority);
        }
    }

    /** @override */
    componentWillUnmount()
    {
        const inputContext = this.props.inputContext;
        if (inputContext)
        {
            inputContext.removeInputHandler(this._graphNodeInputHandler);
        }
    }

    getGraphNodeInputHandler() { return this._graphNodeInputHandler; }

    /** @override */
    render()
    {
        const inputController = this.props.inputController;
        const Renderer = this.props.nodeRenderer || GraphNodeRenderer;
        const editable = this.props.editable;

        const onMouseOver = inputController ? inputController.onMouseOver : null;
        const onMouseOut = inputController ? inputController.onMouseOut : null;

        const nodes = [];
        for (const node of this.props.nodes)
        {
            nodes.push(
                <Renderer
                    key={node.getGraphElementID()}
                    node={node}
                    fill={'var(--color-graph-node)'}
                    stroke={'var(--color-graph-text)'}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    pointerEvents={editable && inputController && inputController.hasPointerEvents(node) ? 'all' : 'none'} />
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