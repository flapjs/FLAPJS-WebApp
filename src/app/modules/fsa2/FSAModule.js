import React from 'react';
import PanelContainer from 'experimental/panels/PanelContainer.js';

import NodalGraphInputManager from 'modules/nodalgraph/manager/NodalGraphInputManager.js';
import ViewportComponent from 'util/input/components/ViewportComponent.js';
import MachineController from './controller/MachineController.js';

import FSAGraph from 'modules/fsa/graph/FSAGraph.js';
import FSAGraphLabeler from 'modules/fsa/graph/FSAGraphLabeler.js';
import * as FSAGraphParser from 'modules/fsa/graph/FSAGraphParser.js';

import FSAGraphRenderer from './renderer/FSAGraphRenderer.js';
import FSALabelEditorRenderer from './renderer/FSALabelEditorRenderer.js';
import GraphInputRenderer from 'modules/nodalgraph/controller/renderer/GraphInputRenderer.js';

import OverviewPanel from './components/panels/overview/OverviewPanel.js';
import TestingPanel from './components/panels/testing/TestingPanel.js';
import AnalysisPanel from './components/panels/analysis/AnalysisPanel.js';

import StringTester from './tester/StringTester.js';
import FSAErrorChecker from './FSAErrorChecker.js';

import EditPane from './components/views/EditPane.js';
import TapePane from './components/views/TapePane.js';
import { CTRL_KEY, SHIFT_KEY } from 'session/manager/hotkey/HotKeyManager.js';
import { RENDER_LAYER_WORKSPACE } from 'session/manager/RenderManager.js';

import SafeGraphEventHandler from 'modules/nodalgraph/SafeGraphEventHandler.js';

import { registerNotifications } from './components/notifications/FSANotifications.js';

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

import StepTracer from './steptracer/StepTracer.js';
import StepTracerView from './steptracer/StepTracerView.js';

import FSABroadcastHandler from './FSABroadcastHandler.js';

import FSAImporter from './filehandlers/FSAImporter.js';
import FSAJFFImporter from './filehandlers/FSAJFFImporter.js';
import FSAExporter from './filehandlers/FSAExporter.js';
import FSAJFFExporter from './filehandlers/FSAJFFExporter.js';
import { registerImageExporters } from 'modules/nodalgraph/filehandlers/NodalGraphImageExporter.js';

const MODULE_NAME = 'fsa2';
const MODULE_VERSION = '0.0.1';

class FSAModule
{
    constructor(app)
    {
        this._app = app;

        this._inputManager = new NodalGraphInputManager(this,
            new FSAGraph(),
            new FSAGraphLabeler(),
            FSAGraphParser,
            FSALabelEditorRenderer);

        app.getRenderManager()
            .addRenderer(RENDER_LAYER_WORKSPACE, props => (
                <ViewportComponent ref={ref => app._workspace.current = ref}>
                    <FSAGraphRenderer currentModule={this} parent={props.workspace} />
                    {this._inputManager.getInputController() && <GraphInputRenderer currentModule={this} />}
                </ViewportComponent>
            ));

        this._machineController = new MachineController(this);

        this._errorChecker = new FSAErrorChecker(app,
            this._inputManager.getGraphController(),
            this._machineController);
        this._tester = new StringTester();
        this._stepTracer = new StepTracer(this.getGraphController(), this.getMachineController());

        this._broadcastHandler = new FSABroadcastHandler();
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
            .registerExporter(new FSAExporter(FSAGraphParser.JSON), 'session')
            .registerExporter(new FSAJFFExporter(FSAGraphParser.XML), 'jflap');

        registerImageExporters(app.getExportManager());
        
        app.getImportManager()
            .addImporter(new FSAImporter(app, FSAGraphParser.JSON), '.fsa.json', '.json')
            .addImporter(new FSAJFFImporter(app, FSAGraphParser.XML), '.jff');

        app.getViewportManager()
            .addViewClass(EditPane)
            .addViewClass(TapePane)
            .addViewClass(StepTracerView);

        app.getDrawerManager()
            .addPanelClass(props => (
                <PanelContainer id={props.id}
                    className={props.className}
                    style={props.style}
                    title={'Finite State Automata'}>
                    <p>{'Brought to you with \u2764 by the Flap.js team.'}</p>
                    <p>{'<- Tap on a tab to begin!'}</p>
                </PanelContainer>
            ))
            .addPanelClass(OverviewPanel)
            .addPanelClass(TestingPanel)
            .addPanelClass(AnalysisPanel);

        app.getHotKeyManager()
            .registerHotKey('Export to PNG', [CTRL_KEY, 'KeyP'], () => { app.getExportManager().tryExportFile('image-png', app.getSession()); })
            .registerHotKey('Save as JSON', [CTRL_KEY, 'KeyS'], () => { app.getExportManager().tryExportFile('session', app.getSession()); })
            .registerHotKey('New', [CTRL_KEY, 'KeyN'], () => { this.clear(app); })
            .registerHotKey('Undo', [CTRL_KEY, 'KeyZ'], () => { app.getUndoManager().undo(); })
            .registerHotKey('Redo', [CTRL_KEY, SHIFT_KEY, 'KeyZ'], () => { app.getUndoManager().redo(); });

        app.getUndoManager()
            .setEventHandlerFactory((...args) =>
            {
                return new SafeGraphEventHandler(this._inputManager.getGraphController(), this._inputManager.getGraphParser());
            });
        
        app.getMenuManager().setSubtitleComponentClass(props => (
            <select onChange={(e) =>
            {
                this._machineController.setMachineType(e.target.value);
            }}
            value={this._machineController.getMachineType()}>
                <option value="DFA">DFA</option>
                <option value="NFA">NFA</option>
            </select>
        ));

        app.getTooltipManager()
            .addTooltip(I18N.toString('message.workspace.empty'))
            .addTooltip('If you need help, try the \'?\' at the top.')
            .addTooltip('Or you can choose to do nothing.')
            .addTooltip('I can\'t do anything about that.')
            .addTooltip('You really should consider doing something though, for the sake of both of us.')
            .addTooltip('Of course, it is your free will.')
            .addTooltip('You do you.')
            .addTooltip('Please do something.')
            .addTooltip('I need my job.')
            .addTooltip(I18N.toString('message.workspace.empty'));

        app.getBroadcastManager()
            .addMessageHandler(this._broadcastHandler);

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
    getStepTracer() { return this._stepTracer; }
    getBroadcastHandler() { return this._broadcastHandler; }

    /** @override */
    getModuleVersion() { return MODULE_VERSION; }
    /** @override */
    getModuleName() { return MODULE_NAME; }
    /** @override */
    getLocalizedModuleName() { return 'Finite Automata'; }
    getApp() { return this._app; }
}

export default FSAModule;
