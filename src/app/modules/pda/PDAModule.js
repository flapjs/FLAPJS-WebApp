import React from 'react';
import PanelContainer from 'experimental/panels/PanelContainer.js';

import NodalGraphInputManager from 'modules/nodalgraph/manager/NodalGraphInputManager.js';
import MachineController from './controller/MachineController.js';
import ViewportComponent from 'util/input/components/ViewportComponent.js';

import PDAGraph from './graph/PDAGraph.js';
import PDAGraphLabeler from './graph/PDAGraphLabeler.js';
import * as PDAGraphParser from './graph/PDAGraphParser.js';

import PDAGraphRenderer from './renderer/PDAGraphRenderer.js';
import PDALabelEditorRenderer from './renderer/PDALabelEditorRenderer.js';
import GraphInputRenderer from 'modules/nodalgraph/controller/renderer/GraphInputRenderer.js';

import OverviewPanel from './components/panels/overview/OverviewPanel.js';
import TestingPanel from './components/panels/testing/TestingPanel.js';
import AnalysisPanel from './components/panels/analysis/AnalysisPanel.js';

import StringTester from './tester/StringTester.js';
import PDAErrorChecker from './PDAErrorChecker.js';

import EditPane from './components/views/EditPane.js';
import TapePane from './components/views/TapePane.js';
import { CTRL_KEY, SHIFT_KEY } from 'session/manager/hotkey/HotKeyManager.js';
import { RENDER_LAYER_WORKSPACE } from 'session/manager/RenderManager.js';

import PDAGraphExporter from './exporter/PDAGraphExporter.js';
import { DEFAULT_IMAGE_EXPORTERS } from 'modules/nodalgraph/NodalGraphImageExporter.js';
import SafeGraphEventHandler from 'modules/nodalgraph/SafeGraphEventHandler.js';

import { registerNotifications } from './components/notifications/PDANotifications.js';

import GraphNodeInputHandler from 'modules/nodalgraph/controller/inputhandler/GraphNodeInputHandler.js';
import GraphInitialInputHandler from 'modules/nodalgraph/controller/inputhandler/GraphInitialInputHandler.js';
import GraphEdgeInputHandler from 'modules/nodalgraph/controller/inputhandler/GraphEdgeInputHandler.js';
import GraphEndpointInputHandler from 'modules/nodalgraph/controller/inputhandler/GraphEndpointInputHandler.js';
import GraphNodeCreateInputHandler from 'modules/nodalgraph/controller/inputhandler/GraphNodeCreateInputHandler.js';
import GraphNodeAcceptInputHandler from 'modules/nodalgraph/controller/inputhandler/GraphNodeAcceptInputHandler.js';

import GraphNodePickHandler from 'modules/nodalgraph/controller/pickhandler/GraphNodePickHandler.js';
import GraphEdgePickHandler from 'modules/nodalgraph/controller/pickhandler/GraphEdgePickHandler.js';
import GraphEndpointPickHandler from 'modules/nodalgraph/controller/pickhandler/GraphEndpointPickHandler.js';
import GraphInitialPickHandler from 'modules/nodalgraph/controller/pickhandler/GraphInitialPickHandler.js';

import * as UserUtil from 'experimental/UserUtil.js';

const MODULE_NAME = 'pda';
const MODULE_LOCALIZED_NAME = 'PDA';
const MODULE_VERSION = '0.0.1';

class PDAModule
{
    constructor(app)
    {
        this._app = app;

        this._inputManager = new NodalGraphInputManager(this,
            new PDAGraph(),
            new PDAGraphLabeler(),
            PDAGraphParser,
            PDALabelEditorRenderer);

        app.getRenderManager()
            .addRenderer(RENDER_LAYER_WORKSPACE, props => (
                <ViewportComponent ref={ref => app._workspace.current = ref}>
                    <PDAGraphRenderer currentModule={this} parent={props.workspace} />
                    {this._inputManager.getInputController() && <GraphInputRenderer currentModule={this} />}
                </ViewportComponent>
            ));

        this._machineController = new MachineController(this);

        this._errorChecker = new PDAErrorChecker(app,
            this._inputManager.getGraphController(),
            this._machineController);
        this._tester = new StringTester();
    }

    /** @override */
    initialize(app)
    {
        this._inputManager.onSessionStart(app.getSession());

        this._inputManager.getInputController().getPicker()
            .addPickHandler(this._initialPickHandler = new GraphInitialPickHandler())
            .addPickHandler(this._endpointPickHandler = new GraphEndpointPickHandler())
            .addPickHandler(this._nodePickHandler = new GraphNodePickHandler())
            .addPickHandler(this._edgePickHandler = new GraphEdgePickHandler());
        this._inputManager.getInputController()
            .addInputHandler(this._nodeInputHandler = new GraphNodeInputHandler())
            .addInputHandler(this._edgeInputHandler = new GraphEdgeInputHandler())
            .addInputHandler(this._endpointInputHandler = new GraphEndpointInputHandler())
            .addInputHandler(this._initialInputHandler = new GraphInitialInputHandler())
            .addInputHandler(this._createInputHandler = new GraphNodeCreateInputHandler())
            .addInputHandler(this._acceptInputHandler = new GraphNodeAcceptInputHandler());

        registerNotifications(app.getNotificationManager());

        //TODO: These should have a pre/post handlers...
        app.getExportManager()
            .addExporter(new PDAGraphExporter())
            .addExporters(DEFAULT_IMAGE_EXPORTERS);

        app.getViewportManager()
            .addViewClass(EditPane)
            .addViewClass(TapePane);

        app.getDrawerManager()
            .addPanelClass(props => (
                <PanelContainer id={props.id}
                    className={props.className}
                    style={props.style}
                    title={'Pushdown Automata'}>
                    <p>{'Brought to you with \u2764 by the Flap.js team.'}</p>
                    <p>{'<- Tap on a tab to begin!'}</p>
                </PanelContainer>
            ))
            .addPanelClass(OverviewPanel)
            .addPanelClass(TestingPanel)
            .addPanelClass(AnalysisPanel);

        app.getHotKeyManager()
            .registerHotKey('Export to PNG', [CTRL_KEY, 'KeyP'], () => { app.getExportManager().tryExportToFile(DEFAULT_IMAGE_EXPORTERS[0]); })
            .registerHotKey('Save as JSON', [CTRL_KEY, 'KeyS'], () => { app.getExportManager().tryExportToFile(app.getExportManager().getDefaultExporter()); })
            .registerHotKey('New', [CTRL_KEY, 'KeyN'], () => { this.clear(app); })
            .registerHotKey('Undo', [CTRL_KEY, 'KeyZ'], () => { app.getUndoManager().undo(); })
            .registerHotKey('Redo', [CTRL_KEY, SHIFT_KEY, 'KeyZ'], () => { app.getUndoManager().redo(); });

        app.getUndoManager()
            .setEventHandlerFactory((...args) => 
            {
                return new SafeGraphEventHandler(this._inputManager.getGraphController(), this._inputManager.getGraphParser());
            });

        const machineController = this.getMachineController();
        machineController.initialize(this);
    }

    /** @override */
    update(app)
    {
        this._inputManager.update(this);

        const machineController = this.getMachineController();
        machineController.update(this);
    }

    /** @override */
    destroy(app)
    {
        this._inputManager.onSessionStop(app.getSession());

        const machineController = this.getMachineController();
        machineController.destroy(this);
    }

    /** @override */
    clear(app, graphOnly = false)
    {
        UserUtil.userClearGraph(app, graphOnly, () => app.getToolbarComponent().closeBar());
    }

    getInputManager() { return this._inputManager; }

    getInputController() { return this._inputManager.getInputController(); }
    getMachineController() { return this._machineController; }
    getGraphController() { return this._inputManager.getGraphController(); }

    getErrorChecker() { return this._errorChecker; }
    getStringTester() { return this._tester; }

    /** @override */
    getModuleVersion() { return MODULE_VERSION; }
    /** @override */
    getModuleName() { return MODULE_NAME; }
    /** @override */
    getLocalizedModuleName() { return MODULE_LOCALIZED_NAME; }
    getApp() { return this._app; }
}

export default PDAModule;
