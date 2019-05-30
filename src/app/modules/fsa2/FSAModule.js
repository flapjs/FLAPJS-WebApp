import React from 'react';

import { userClearGraph } from 'experimental/UserUtil.js';
import { CTRL_KEY } from 'session/manager/hotkey/HotKeyManager.js';
import { RENDER_LAYER_WORKSPACE } from 'session/manager/RenderManager.js';

import FSAGraph from './graph/FSAGraph.js';
import FSAGraphController from './graph/FSAGraphController.js';
import MachineController from './machine/MachineController.js';

import StringTester from './tester/StringTester.js';
import FSAErrorChecker from './FSAErrorChecker.js';
import { registerNotifications } from './components/notifications/FSANotifications.js';

import * as FSAGraphParser from './FSAGraphParser.js';
import FSAImporter from './filehandlers/FSAImporter.js';
import FSAJFFImporter from './filehandlers/FSAJFFImporter.js';
import FSAExporter from './filehandlers/FSAExporter.js';
import FSAJFFExporter from './filehandlers/FSAJFFExporter.js';
import { registerImageExporters } from 'modules/nodegraph/filehandlers/NodalGraphImageExporter.js';

import SafeGraphEventHandler from 'modules/nodegraph/SafeGraphEventHandler.js';

import FSABroadcastHandler from './FSABroadcastHandler.js';
import TutorialHandler from './TutorialHandler.js';

/* COMPONENTS */

import PanelContainer from 'experimental/panels/PanelContainer.js';

import OverviewPanel from './components/panels/overview/OverviewPanel.js';
import TestingPanel from './components/panels/testing/TestingPanel.js';
import AnalysisPanel from './components/panels/analysis/AnalysisPanel.js';

import FSAGraphLayer from './components/layers/FSAGraphLayer.js';
import FSAGraphOverlayLayer from './components/layers/FSAGraphOverlayLayer.js';
import FSATapeGraphOverlayLayer from './components/layers/FSATapeGraphOverlayLayer.js';

import GraphView from 'graph2/components/GraphView.js';

const MODULE_NAME = 'fsa';
const MODULE_VERSION = '3.0.0';

class FSAModule
{
    constructor(app)
    {
        this._app = app;

        this._graph = new FSAGraph();
        this._graphController = new FSAGraphController(app, this._graph, null);
        this._graphViewComponent = React.createRef();
        
        const graphController = this._graphController;

        app.getRenderManager()
            .addRenderer(RENDER_LAYER_WORKSPACE, props => (
                <GraphView
                    ref={this._graphViewComponent}
                    renderGraph={graphView =>
                    {
                        return <FSAGraphLayer
                            graphView={graphView}
                            graphController={graphController}
                            editable={!this._testMode}
                            session={this._app.getSession()} />;
                    }}
                    renderOverlay={graphView =>
                    {
                        if (!this._testMode)
                        {
                            return <FSAGraphOverlayLayer
                                graphView={graphView}
                                graphController={graphController}
                                session={this._app.getSession()} />;
                        }
                        else
                        {
                            return <FSATapeGraphOverlayLayer
                                graphView={graphView}
                                tester={this._tester} />;
                        }
                    }}>
                </GraphView>
            ));
        this._machineController = new MachineController(this);

        this._errorChecker = new FSAErrorChecker(app,
            this._graphController,
            this._machineController);
        this._tester = new StringTester();
        this._testMode = false;

        this._broadcastHandler = new FSABroadcastHandler();
        this._tutorialHandler = new TutorialHandler(app);
    }

    /** @override */
    initialize(app)
    {
        registerNotifications(app.getNotificationManager());

        // TODO: These should have a pre/post handlers...
        app.getExportManager()
            .registerExporter(new FSAExporter(FSAGraphParser.JSON), 'session')
            .registerExporter(new FSAJFFExporter(FSAGraphParser.XML), 'jflap');

        registerImageExporters(app.getExportManager());

        app.getImportManager()
            .addImporter(new FSAImporter(app, FSAGraphParser.JSON), '.fsa.json', '.json')
            .addImporter(new FSAJFFImporter(app, FSAGraphParser.XML), '.jff');

        app.getUndoManager()
            .setEventHandlerFactory((...args) => new SafeGraphEventHandler(
                this._graphController, FSAGraphParser.JSON));

        app.getDrawerManager()
            .addPanelClass(props => (
                <PanelContainer id={props.id}
                    className={props.className}
                    style={props.style}
                    title={'Finite State Automata'}>
                    <p>{'Brought to you with \u2764 by the Flap.js team.'}</p>
                    <p>{'<- Tap on a tab to begin!'}</p>
                    <div style={{position: 'absolute', bottom: 0, right: 0, marginRight: '1em'}}>
                        {'Looking for Bab\'s Tutorial?'}
                        <div style={{display: 'flex', margin: '0.5em 0'}}>
                            <button style={{flex: 1}} onClick={e =>
                            {
                                app.getDrawerComponent().closeDrawer();
                                this._tutorialHandler.start(app, true);
                            }}>
                                {I18N.toString('message.action.next')}
                            </button>
                        </div>
                    </div>
                </PanelContainer>
            ))
            .addPanelClass(OverviewPanel)
            .addPanelClass(TestingPanel)
            .addPanelClass(AnalysisPanel);

        app.getHotKeyManager()
            .registerHotKey('Export to PNG', [CTRL_KEY, 'KeyP'], () => { app.getExportManager().tryExportFile('image-png', app.getSession()); })
            .registerHotKey('Save as JSON', [CTRL_KEY, 'KeyS'], () => { app.getExportManager().tryExportFile('session', app.getSession()); });
        
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

        this._machineController.initialize(this);
        this._graphController.initialize();

        this._tutorialHandler.start(app);
    }

    /** @override */
    update(app)
    {
        this._graphController.update();
        this._machineController.update(this);
    }

    /** @override */
    destroy(app)
    {
        this._machineController.destroy(this);
        this._graphController.destroy();
    }

    /** @override */
    clear(app, graphOnly = false)
    {
        userClearGraph(app, graphOnly, () => app.getToolbarComponent().closeBar());
    }

    getMachineController() { return this._machineController; }
    getGraphController() { return this._graphController; }
    getGraphView() { return this._graphViewComponent.current; }

    getErrorChecker() { return this._errorChecker; }
    getStringTester() { return this._tester; }
    getBroadcastHandler() { return this._broadcastHandler; }

    /** @override */
    getModuleVersion() { return MODULE_VERSION; }
    /** @override */
    getModuleName() { return MODULE_NAME; }
    /** @override */
    getLocalizedModuleName() { return 'Finite Automata'; }
    /** @override */
    getApp() { return this._app; }
}

export default FSAModule;
