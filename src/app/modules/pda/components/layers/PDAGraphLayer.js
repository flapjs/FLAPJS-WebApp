import React from 'react';

import GraphNodeLayer from 'graph2/components/layers/GraphNodeLayer.js';
import GraphEdgeLayer from 'graph2/components/layers/GraphEdgeLayer.js';
import SelectionBoxLayer from 'graph2/components/layers/SelectionBoxLayer.js';
import IndexedGraphStartMarkerLayer from 'graph2/components/layers/IndexedGraphStartMarkerLayer.js';

import PDANodeRenderer from '../../graph/renderer/PDANodeRenderer.js';
import PDANodeInputHandler from '../../graph/inputhandler/PDANodeInputHandler.js';

import PDAEdgeRenderer from '../../graph/renderer/PDAEdgeRenderer.js';

class PDAGraphLayer extends React.Component
{
    constructor(props)
    {
        super(props);

        const graphView = props.graphView;
        const graphController = props.graphController;
        const inputController = graphView.getInputController();

        this._fsaNodeInputHandler = new PDANodeInputHandler(inputController, graphController);
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
        const editable = this.props.editable;

        const graph = graphController.getGraph();
        const inputController = graphView.getInputController();
        const inputContext = graphView.getInputContext();

        return (
            <React.Fragment>
                <IndexedGraphStartMarkerLayer
                    inputController={inputController}
                    graphController={graphController}
                    inputContext={inputContext}
                    inputPriority={-1}
                    editable={editable} />
                <GraphNodeLayer
                    nodes={graph.getNodes()}
                    inputController={inputController}
                    graphController={graphController}
                    nodeRenderer={PDANodeRenderer}
                    inputContext={inputContext}
                    inputPriority={-1}
                    editable={editable} />
                <GraphEdgeLayer
                    ref={ref =>
                    {
                        if (!ref) return;
                        ref.getGraphEdgeInputHandler()
                            .setShouldDeleteEdgeWithEmptyLabel(true)
                            .setShouldDeleteEdgePlaceholder(true);
                    }}
                    edges={graph.getEdges()}
                    inputController={inputController}
                    graphController={graphController}
                    edgeRenderer={PDAEdgeRenderer}
                    inputContext={inputContext}
                    inputPriority={-1}
                    editable={editable} />
                <SelectionBoxLayer
                    inputController={inputController}
                    graphController={graphController}
                    inputContext={inputContext}
                    inputPriority={-1} />
            </React.Fragment>
        );
    }
}

export default PDAGraphLayer;
