import React from 'react';

import GraphNodeLayer from 'graph2/components/layers/GraphNodeLayer.js';
import GraphEdgeLayer from 'graph2/components/layers/GraphEdgeLayer.js';
import SelectionBoxLayer from 'graph2/components/layers/SelectionBoxLayer.js';

import FSANodeRenderer from '../graph/renderer/FSANodeRenderer.js';
import FSAInitialMarkerLayer from '../graph/renderer/FSAInitialMarkerLayer.js';

import FSANodeInputHandler from '../graph/inputhandler/FSANodeInputHandler.js';

class FSAGraphLayer extends React.Component
{
    constructor(props)
    {
        super(props);

        const graphView = props.graphView;
        const graphController = props.graphController;
        const inputController = graphView.getInputController();

        this._fsaNodeInputHandler = new FSANodeInputHandler(inputController, graphController);
    }

    /** @override */
    componentDidMount()
    {
        const graphView = this.props.graphView;
        const inputContext = graphView.getInputContext();
        inputContext.addInputHandler(this._fsaNodeInputHandler);
    }

    /** @override */
    componentWillUnmount()
    {
        const graphView = this.props.graphView;
        const inputContext = graphView.getInputContext();
        inputContext.removeInputHandler(this._fsaNodeInputHandler);
    }

    /** @override */
    render()
    {
        const graphView = this.props.graphView;
        const graphController = this.props.graphController;
        const graph = graphController.getGraph();

        return (
            <React.Fragment>
                <FSAInitialMarkerLayer
                    inputController={graphView.getInputController()}
                    graphController={graphController}
                    inputContext={graphView.getInputContext()}
                    inputPriority={-1} />
                <GraphNodeLayer
                    nodes={graph.getNodes()}
                    inputController={graphView.getInputController()}
                    graphController={graphController}
                    nodeRenderer={FSANodeRenderer}
                    inputContext={graphView.getInputContext()}
                    inputPriority={-1} />
                <GraphEdgeLayer
                    ref={ref =>
                    {
                        if (!ref) return;
                        ref.getGraphEdgeInputHandler()
                            .setShouldDeleteEdgeWithEmptyLabel(true)
                            .setShouldDeleteEdgePlaceholder(true);
                    }}
                    edges={graph.getEdges()}
                    inputController={graphView.getInputController()}
                    graphController={graphController}
                    inputContext={graphView.getInputContext()}
                    inputPriority={-1} />
                <SelectionBoxLayer
                    inputController={graphView.getInputController()}
                    graphController={graphController}
                    inputContext={graphView.getInputContext()}
                    inputPriority={-1} />
            </React.Fragment>
        );
    }
}

export default FSAGraphLayer;
