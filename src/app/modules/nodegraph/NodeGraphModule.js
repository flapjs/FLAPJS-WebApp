import React from 'react';
import PanelContainer from 'experimental/panels/PanelContainer.js';

import * as UserUtil from 'experimental/UserUtil.js';
import { RENDER_LAYER_WORKSPACE } from 'session/manager/RenderManager.js';
import GraphEditorView from 'graph2/components/views/GraphEditorView.js';

import NodeGraph from 'graph2/NodeGraph.js';
import GraphNode from 'graph2/element/GraphNode.js';
import QuadraticEdge from 'graph2/element/QuadraticEdge.js';
import NodeGraphParser from 'graph2/NodeGraphParser.js';
import NodeGraphController from './graph/controller/NodeGraphController.js';

import NodalGraphExporter from './exporter/NodalGraphExporter.js';
import { DEFAULT_IMAGE_EXPORTERS } from './exporter/NodalGraphImageExporter.js';

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
    }

    //Override
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

        app.getExportManager()
            .addExporter(new NodalGraphExporter())
            .addExporters(DEFAULT_IMAGE_EXPORTERS);

        app.getRenderManager()
            .addRenderer(RENDER_LAYER_WORKSPACE, props => (
                <GraphEditorView graphController={this._graphController} />
            ));
    }

    //Override
    update(app)
    {
    }

    //Override
    destroy(app)
    {
    }

    //Override
    clear(app, graphOnly = false)
    {
        UserUtil.userClearGraph(app, graphOnly, () => app.getToolbarComponent().closeBar());
    }

    getGraphController() { return this._graphController; }

    //Override
    getModuleVersion() { return MODULE_VERSION; }
    //Override
    getModuleName() { return MODULE_NAME; }
    //Override
    getLocalizedModuleName() { return MODULE_LOCALIZED_NAME; }

    getApp() { return this._app; }
}

export default NodalGraphModule;
