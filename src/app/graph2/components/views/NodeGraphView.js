import React from 'react';

import GraphNodeLayer from '../layers/GraphNodeLayer.js';
import GraphEdgeLayer from '../layers/GraphEdgeLayer.js';
import SelectionBoxLayer from '../layers/SelectionBoxLayer.js';

import InputContext from 'util/input/InputContext.js';
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
        const inputAdapter = viewport.getInputAdapter();

        const context = this._inputContext;
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
                <SelectionBoxLayer
                    inputController={inputController}
                    graphController={graphController}
                    selectionBox={selectionBox}
                    inputContext={this._inputContext}
                    inputPriority={0} />
            </React.Fragment>
        );
    }
}

export default NodeGraphView;