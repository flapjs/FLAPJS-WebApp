import React from 'react';

import BoxRenderer from 'graph2/renderer/BoxRenderer.js';

import GraphNodeLayer from '../layers/GraphNodeLayer.js';
import GraphEdgeLayer from '../layers/GraphEdgeLayer.js';
import GraphHighlightLayer from '../layers/GraphHighlightLayer.js';

import InputContext from 'util/input/InputContext.js';
import SelectionBoxInputHandler from 'graph2/inputs/SelectionBoxInputHandler.js';
import ViewportInputHandler from 'graph2/inputs/ViewportInputHandler.js';

class NodeGraphView extends React.Component
{
    constructor(props)
    {
        super(props);

        this._inputContext = new InputContext();
    }

    /** @override */
    componentDidMount()
    {
        const viewport = this.props.viewport;
        const inputController = this.props.inputController;
        const graphController = this.props.graphController;
        const selectionBox = this.props.selectionBox;
        const inputAdapter = viewport.getInputAdapter();

        const context = this._inputContext;
        if (selectionBox)
        {
            context.addInputHandler(new SelectionBoxInputHandler(inputController, graphController, selectionBox));
        }
        if (inputController)
        {
            context.addInputHandler(new ViewportInputHandler(inputController));
        }
        inputAdapter.bindContextAsLast(context);
    }

    /** @override */
    componentWillUnmount()
    {
        const viewport = this.props.viewport;
        const inputAdapter = viewport.getInputAdapter();
        const context = this._inputContext;
        context.clearInputHandlers();
        inputAdapter.unbindContext(context);
    }

    getInputContext() { return this._inputContext; }

    /** @override */
    render()
    {
        const inputController = this.props.inputController;
        const graphController = this.props.graphController;
        const selectionBox = this.props.selectionBox;
        const onMouseOver = this.props.onMouseOver;
        const onMouseOut = this.props.onMouseOut;

        const graph = graphController.getGraph();
        const selectionBoundingBox = selectionBox ? selectionBox.getBoundingBox() : null;

        // Order matters here, it determines the z-index!
        return (
            <React.Fragment>
                <GraphNodeLayer nodes={graph.getNodes()}
                    inputController={inputController}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut} />
                <GraphEdgeLayer edges={graph.getEdges()}
                    inputController={inputController}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut} />
                {selectionBox &&
                    <React.Fragment>
                        <GraphHighlightLayer
                            nodes={selectionBox.getSelection()} />
                        <BoxRenderer visible={selectionBox.isVisible()}
                            fromX={selectionBoundingBox.fromX}
                            fromY={selectionBoundingBox.fromY}
                            toX={selectionBoundingBox.toX}
                            toY={selectionBoundingBox.toY} />
                    </React.Fragment>}
            </React.Fragment>
        );
    }
}

export default NodeGraphView;