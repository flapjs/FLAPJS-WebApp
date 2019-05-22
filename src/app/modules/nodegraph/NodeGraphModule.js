import React from 'react';

import { userClearGraph } from 'experimental/UserUtil.js';
import { CTRL_KEY } from 'session/manager/hotkey/HotKeyManager.js';
import { RENDER_LAYER_WORKSPACE } from 'session/manager/RenderManager.js';

import NodeGraph from 'graph2/NodeGraph.js';
import GraphNode from 'graph2/element/GraphNode.js';
import QuadraticEdge from 'graph2/element/QuadraticEdge.js';

import NodeGraphParser from 'graph2/NodeGraphParser.js';
import NodeGraphController from './graph/NodeGraphController.js';

import { registerImageExporters } from './filehandlers/NodalGraphImageExporter.js';

import SafeUndoNodeGraphEventHandler from 'graph2/SafeUndoNodeGraphEventHandler.js';

/* COMPONENTS */

import PanelContainer from 'experimental/panels/PanelContainer.js';

import NodeGraphLayer from './components/layers/NodeGraphLayer.js';
import NodeGraphOverlayLayer from './components/layers/NodeGraphOverlayLayer.js';

import GraphView from 'graph2/components/GraphView.js';

const MODULE_NAME = 'nodegraph';
const MODULE_VERSION = '0.0.1';
const MODULE_LOCALIZED_NAME = 'Node Graph';

class NodalGraphModule
{
    constructor(app)
    {
        this._app = app;

        this._graph = new NodeGraph(GraphNode, QuadraticEdge);
        this._graphParser = new NodeGraphParser();
        this._graphController = new NodeGraphController(app, this._graph);
        this._graphViewComponent = React.createRef();

        const graphController = this._graphController;

        app.getRenderManager()
            .addRenderer(RENDER_LAYER_WORKSPACE, props => (
                <GraphView
                    ref={this._graphViewComponent}
                    renderGraph={graphView =>
                        <NodeGraphLayer graphView={graphView} graphController={graphController} editable={true} />}
                    renderOverlay={graphView =>
                        <NodeGraphOverlayLayer graphView={graphView} graphController={graphController} session={this._app.getSession()} />}>
                </GraphView>
            ));
    }

    /** @override */
    initialize(app)
    {
        registerImageExporters(app.getExportManager());

        app.getUndoManager()
            .setEventHandlerFactory((...args) =>
                new SafeUndoNodeGraphEventHandler(this._graphController, this._graphParser));

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

        app.getHotKeyManager()
            .registerHotKey('Export to PNG', [CTRL_KEY, 'KeyP'], () => { app.getExportManager().tryExportFile('image-png', app.getSession()); });

        this._graphController.initialize();
    }

    /** @override */
    update(app)
    {
        this._graphController.update();
    }

    /** @override */
    destroy(app)
    {
        this._graphController.destroy();
    }

    /** @override */
    clear(app, graphOnly = false)
    {
        userClearGraph(app, graphOnly, () => app.getToolbarComponent().closeBar());
    }

    getGraphController() { return this._graphController; }
    getGraphView() { return this._graphViewComponent.current; }

    /** @override */
    getModuleVersion() { return MODULE_VERSION; }
    /** @override */
    getModuleName() { return MODULE_NAME; }
    /** @override */
    getLocalizedModuleName() { return MODULE_LOCALIZED_NAME; }

    getApp() { return this._app; }
}

export default NodalGraphModule;
