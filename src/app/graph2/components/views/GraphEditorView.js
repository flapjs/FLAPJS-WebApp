import React from 'react';

import LabelEditorView from './LabelEditorView.js';

import GraphNodeLayer from '../layers/GraphNodeLayer.js';
import GraphEdgeLayer from '../layers/GraphEdgeLayer.js';
import SelectionBoxLayer from '../layers/SelectionBoxLayer.js';

import ViewportLayer from '../layers/ViewportLayer.js';
import ViewportNavigationLayer from '../layers/ViewportNavigationLayer.js';

import GraphView from './GraphView.js';

class GraphEditorView extends React.Component
{
    constructor(props)
    {
        super(props);

        this._graphViewComponent = React.createRef();
        
        this._labelEditorComponent = React.createRef();
    }

    /** @override */
    componentDidMount()
    {
        const graphController = this.props.graphController;
        graphController.initialize();
    }

    /** @override */
    componentDidUpdate()
    {
        this.props.graphController.update();
    }

    /** @override */
    componentWillUnmount()
    {
        this.props.graphController.destroy();
    }

    getLabelEditorComponent() { return this._labelEditorComponent.current; }
    getGraphView() { return this._graphViewComponent.current; }

    /** @override */
    render()
    {
        const graphController = this.props.graphController;
        const labelFormatter = graphController.getLabelFormatter();
        const graph = graphController.getGraph();

        return (
            <GraphView
                ref={this._graphViewComponent}
                renderGraph={graphView => (
                    <React.Fragment>
                        <GraphNodeLayer nodes={graph.getNodes()}
                            inputController={graphView.getInputController()}
                            graphController={graphController}
                            inputContext={graphView.getInputContext()}
                            inputPriority={-1} />
                        <GraphEdgeLayer edges={graph.getEdges()}
                            inputController={graphView.getInputController()}
                            graphController={graphController}
                            inputContext={graphView.getInputContext()}
                            inputPriority={-1} />
                        <SelectionBoxLayer
                            inputController={graphView.getInputController()}
                            graphController={graphController}
                            inputContext={graphView.getInputContext()}
                            inputPriority={-1} />
                        {this.props.children}
                    </React.Fragment>
                )}
                renderOverlay={graphView => (
                    <React.Fragment>
                        <ViewportLayer
                            graphController={graphController}
                            inputController={graphView.getInputController()}
                            viewport={graphView.getViewportComponent()}>
                            <ViewportNavigationLayer
                                style={{ right: 0 }}
                                viewportAdapter={graphView.getViewportComponent().getInputAdapter().getViewportAdapter()} />
                            {this.props.overlay}
                        </ViewportLayer>
                        <LabelEditorView ref={ref =>
                        {
                            this._labelEditorComponent.current = ref;
                            graphController.setLabelEditor(ref);
                        }}
                        labelFormatter={labelFormatter}
                        viewport={graphView.getViewportComponent()}
                        saveOnExit={true}>
                            {this.props.labelEditor}
                        </LabelEditorView>
                    </React.Fragment>
                )}>
            </GraphView>
        );
    }
}

export default GraphEditorView;
