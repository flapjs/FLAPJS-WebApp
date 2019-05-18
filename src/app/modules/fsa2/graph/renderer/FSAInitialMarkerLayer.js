import React from 'react';

import FSAInitialMarkerRenderer from './FSAInitialMarkerRenderer.js';
import FSAInitialMarkerInputHandler from '../inputhandler/FSAInitialMarkerInputHandler.js';

class FSAInitialMarkerLayer extends React.Component
{
    constructor(props)
    {
        super(props);

        const inputController = props.inputController;
        const graphController = props.graphController;

        this._initialMarkerInputHandler = new FSAInitialMarkerInputHandler(inputController, graphController);
    }

    /** @override */
    componentDidMount()
    {
        const inputContext = this.props.inputContext;
        if (inputContext)
        {
            const inputPriority = this.props.inputPriority || -1;
            inputContext.addInputHandler(this._initialMarkerInputHandler, inputPriority);
        }
    }

    /** @override */
    componentWillUnmount()
    {
        const inputContext = this.props.inputContext;
        if (inputContext)
        {
            inputContext.removeInputHandler(this._initialMarkerInputHandler);
        }
    }

    /** @override */
    render()
    {
        const inputController = this.props.inputController;
        const Renderer = this.props.initialMarkerRenderer || FSAInitialMarkerRenderer;
        const editable = this.props.editable;

        const graphController = this.props.graphController;
        const target = this._initialMarkerInputHandler.getGhostMarker() || graphController.getGraph().getStartNode();

        const onMouseOver = inputController ? inputController.onMouseOver : null;
        const onMouseOut = inputController ? inputController.onMouseOut : null;
        
        return (
            <g>
                {target &&
                    <Renderer
                        node={target}
                        color={'var(--color-graph-text)'}
                        onMouseOver={onMouseOver}
                        onMouseOut={onMouseOut}
                        pointerEvents={editable && inputController && inputController.hasPointerEvents(target) ? 'all' : 'none'} />}
            </g>
        );
    }
}

export default FSAInitialMarkerLayer;