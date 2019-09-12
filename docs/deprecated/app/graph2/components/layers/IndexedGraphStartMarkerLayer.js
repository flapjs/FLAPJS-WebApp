import React from 'react';

import StartNodeMarkerRenderer from '../../renderer/StartNodeMarkerRenderer.js';
import IndexedGraphStartMarkerInputHandler from '../../inputhandler/IndexedGraphStartMarkerInputHandler.js';

class IndexedGraphStartMarkerLayer extends React.Component
{
    constructor(props)
    {
        super(props);

        const inputController = props.inputController;
        const graphController = props.graphController;

        this._startMarkerInputHandler = new IndexedGraphStartMarkerInputHandler(inputController, graphController);
    }

    /** @override */
    componentDidMount()
    {
        const inputContext = this.props.inputContext;
        if (inputContext)
        {
            const inputPriority = this.props.inputPriority || -1;
            inputContext.addInputHandler(this._startMarkerInputHandler, inputPriority);
        }
    }

    /** @override */
    componentWillUnmount()
    {
        const inputContext = this.props.inputContext;
        if (inputContext)
        {
            inputContext.removeInputHandler(this._startMarkerInputHandler);
        }
    }

    /** @override */
    render()
    {
        const inputController = this.props.inputController;
        const Renderer = this.props.startMarkerRenderer || StartNodeMarkerRenderer;
        const editable = this.props.editable;

        const graphController = this.props.graphController;
        const graph = graphController.getGraph();
        let target = this._startMarkerInputHandler.getGhostMarker();
        
        if ('getStartNode' in graph && !target)
        {
            target = graph.getStartNode();
        }

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

export default IndexedGraphStartMarkerLayer;