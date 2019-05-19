import React from 'react';

import GraphNodeLayer from 'graph2/components/layer/GraphNodeLayer.js';
import GraphEdgeLayer from 'graph2/components/layer/GraphEdgeLayer.js';
import SelectionBoxLayer from 'graph2/components/layer/SelectionBoxLayer.js';
import GraphStartMarkerLayer from 'graph2/components/layer/GraphStartMarkerLayer.js';

import FSANodeRenderer from '../graph/renderer/FSANodeRenderer.js';
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
        const editable = this.props.editable;

        const graph = graphController.getGraph();
        const inputController = graphView.getInputController();
        const inputContext = graphView.getInputContext();

        return (
            <React.Fragment>
                <GraphStartMarkerLayer
                    inputController={inputController}
                    graphController={graphController}
                    inputContext={inputContext}
                    inputPriority={-1}
                    editable={editable} />
                <GraphNodeLayer
                    nodes={graph.getNodes()}
                    inputController={inputController}
                    graphController={graphController}
                    nodeRenderer={FSANodeRenderer}
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

export default FSAGraphLayer;
