import React from 'react';

import GraphEdgeRenderer from 'graph2/renderer/GraphEdgeRenderer.js';

import GraphEdgeInputHandler from 'graph2/inputs/GraphEdgeInputHandler.js';

class GraphEdgeLayer extends React.Component
{
    constructor(props)
    {
        super(props);

        const inputController = props.inputController;
        const graphController = props.graphController;
        
        this._graphEdgeInputHandler = new GraphEdgeInputHandler(inputController, graphController);
    }

    /** @override */
    componentDidMount()
    {
        const inputContext = this.props.inputContext;
        if (inputContext)
        {
            const inputPriority = this.props.inputPriority || -1;
            inputContext.addInputHandler(this._graphEdgeInputHandler, inputPriority);
        }
    }

    /** @override */
    componentWillUnmount()
    {
        const inputContext = this.props.inputContext;
        if (inputContext)
        {
            inputContext.removeInputHandler(this._graphEdgeInputHandler);
        }
    }

    /** @override */
    render()
    {
        const inputController = this.props.inputController;
        const Renderer = this.props.edgeRenderer || GraphEdgeRenderer;
		
        const edges = [];
        for(const edge of this.props.edges)
        {
            edges.push(
                <Renderer
                    key={edge.getGraphElementID()}
                    edge={edge}
                    stroke={'var(--color-graph-text)'}
                    onMouseOver={inputController.onMouseOver}
                    onMouseOut={inputController.onMouseOut}
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