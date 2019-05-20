import React from 'react';

import GraphNodeLayer from 'graph2/components/layers/GraphNodeLayer.js';
import GraphEdgeLayer from 'graph2/components/layers/GraphEdgeLayer.js';
import SelectionBoxLayer from 'graph2/components/layers/SelectionBoxLayer.js';
import IndexedGraphStartMarkerLayer from 'graph2/components/layers/IndexedGraphStartMarkerLayer.js';

class NodeGraphLayer extends React.Component
{
    constructor(props) { super(props); }

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
                    inputContext={inputContext}
                    inputPriority={-1}
                    editable={editable} />
                <GraphEdgeLayer
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

export default NodeGraphLayer;
