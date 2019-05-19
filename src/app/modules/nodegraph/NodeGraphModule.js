import React from 'react';
import PanelContainer from 'experimental/panels/PanelContainer.js';

import { userClearGraph } from 'experimental/UserUtil.js';
import { RENDER_LAYER_WORKSPACE } from 'session/manager/RenderManager.js';

import NodeGraph from 'graph2/NodeGraph.js';
import GraphNode from 'graph2/element/GraphNode.js';
import QuadraticEdge from 'graph2/element/QuadraticEdge.js';
import NodeGraphParser from 'graph2/NodeGraphParser.js';
import NodeGraphController from './graph/controller/NodeGraphController.js';

import GraphView from 'graph2/components/GraphView.js';
import GraphNodeLayer from 'graph2/components/layers/GraphNodeLayer.js';
import GraphEdgeLayer from 'graph2/components/layers/GraphEdgeLayer.js';
import SelectionBoxLayer from 'graph2/components/layers/SelectionBoxLayer.js';
import ViewportEditLayer from 'graph2/components/layers/ViewportEditLayer.js';
import ViewportNavigationLayer from 'graph2/components/layers/ViewportNavigationLayer.js';
import LabelEditorWidget from 'graph2/components/widgets/LabelEditorWidget.js';

const MODULE_NAME = 'nodegraph';
const MODULE_VERSION = '0.0.1';
const MODULE_LOCALIZED_NAME = 'Node Graph';

class NodalGraphModule
{
    constructor(app)
    {
        this._app = app;

        this._graph = new NodeGraph(GraphNode, QuadraticEdge);
        this._graphController = new NodeGraphController(app, this._graph, new NodeGraphParser());
        this._graphViewComponent = React.createRef();

        const graph = this._graph;
        const graphController = this._graphController;
        const labelFormatter = graphController.getLabelFormatter();

        app.getRenderManager()
            .addRenderer(RENDER_LAYER_WORKSPACE, props => (
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
                        </React.Fragment>
                    )}
                    renderOverlay={graphView => (
                        <React.Fragment>
                            <ViewportEditLayer
                                graphController={graphController}
                                inputController={graphView.getInputController()}
                                viewport={graphView.getViewportComponent()} />
                            <ViewportNavigationLayer
                                style={{ right: 0 }}
                                viewportAdapter={graphView.getViewportComponent().getInputAdapter().getViewportAdapter()} />
                            <LabelEditorWidget ref={ref => graphController.setLabelEditor(ref)}
                                labelFormatter={labelFormatter}
                                viewport={graphView.getViewportComponent()}
                                saveOnExit={true}>
                            </LabelEditorWidget>
                        </React.Fragment>
                    )}>
                </GraphView>
            ));
    }

    /** @override */
    initialize(app)
    {
        app.getDrawerManager()
            .addPanelClass(props => (
                <PanelContainer id={props.id}
                    className={props.className}
                    style={props.style}
                    title={'Your Average Graph Editor'}>
                    <p>{'Brought to you with \u2764 by the Flap.js team.'}</p>
                    <p>{'<- Tap on a tab to begin!'}</p>
                </PanelContainer>
            ));
    }

    /** @override */
    update(app)
    {
    }

    /** @override */
    destroy(app)
    {
    }

    /** @override */
    clear(app, graphOnly = false)
    {
        userClearGraph(app, graphOnly, () => app.getToolbarComponent().closeBar());
    }

    getGraphController() { return this._graphController; }

    /** @override */
    getModuleVersion() { return MODULE_VERSION; }
    /** @override */
    getModuleName() { return MODULE_NAME; }
    /** @override */
    getLocalizedModuleName() { return MODULE_LOCALIZED_NAME; }

    getApp() { return this._app; }
}

export default NodalGraphModule;
