import React from 'react';

import { userClearGraph } from 'experimental/UserUtil.js';
import { CTRL_KEY } from 'session/manager/hotkey/HotKeyManager.js';
import { RENDER_LAYER_WORKSPACE } from 'session/manager/RenderManager.js';

import PDAGraph from './graph/PDAGraph.js';
import PDAGraphController from './graph/PDAGraphController.js';
import MachineController from './machine/MachineController.js';

import StringTester from './tester/StringTester.js';
import PDAErrorChecker from './PDAErrorChecker.js';
import { registerNotifications } from './components/notifications/PDANotifications.js';

import * as PDAGraphParser from './PDAGraphParser.js';
import PDAImporter from './filehandlers/PDAImporter.js';
import PDAExporter from './filehandlers/PDAExporter.js';
import { registerImageExporters } from 'modules/nodegraph/filehandlers/NodalGraphImageExporter.js';

import SafeGraphEventHandler from 'modules/nodegraph/SafeGraphEventHandler.js';

/* COMPONENTS */

import PanelContainer from 'experimental/panels/PanelContainer.js';

import OverviewPanel from './components/panels/overview/OverviewPanel.js';
import TestingPanel from './components/panels/testing/TestingPanel.js';
import AnalysisPanel from './components/panels/analysis/AnalysisPanel.js';

import PDAGraphLayer from './components/layers/PDAGraphLayer.js';
import PDAGraphOverlayLayer from './components/layers/PDAGraphOverlayLayer.js';
import PDATapeGraphOverlayLayer from './components/layers/PDATapeGraphOverlayLayer.js';

import GraphView from 'graph2/components/GraphView.js';

const MODULE_NAME = 'pda';
const MODULE_LOCALIZED_NAME = 'Pushdown Automata';
const MODULE_VERSION = '0.0.1';

class PDAModule
{
    constructor(app)
    {
        this._app = app;

        this._graph = new PDAGraph();
        this._graphController = new PDAGraphController(app, this._graph, null);
        this._graphViewComponent = React.createRef();

        const graphController = this._graphController;

        app.getRenderManager()
            .addRenderer(RENDER_LAYER_WORKSPACE, props => (
                <GraphView
                    ref={this._graphViewComponent}
                    renderGraph={graphView =>
                    {
                        return <PDAGraphLayer
                            graphView={graphView}
                            graphController={graphController}
                            editable={!this._testMode} />;
                    }}
                    renderOverlay={graphView =>
                    {
                        if (!this._testMode)
                        {
                            return <PDAGraphOverlayLayer
                                graphView={graphView}
                                graphController={graphController}
                                session={this._app.getSession()} />;
                        }
                        else
                        {
                            return <PDATapeGraphOverlayLayer
                                graphView={graphView}
                                tester={this._tester} />;
                        }
                    }}>
                </GraphView>
            ));

        this._machineController = new MachineController(this);

        this._errorChecker = new PDAErrorChecker(app,
            this._graphController,
            this._machineController);
        this._tester = new StringTester();
        this._testMode = false;
    }

    /** @override */
    initialize(app)
    {
        registerNotifications(app.getNotificationManager());

        app.getExportManager()
            .registerExporter(new PDAExporter(PDAGraphParser.JSON), 'session');

        registerImageExporters(app.getExportManager());
        
        app.getImportManager()
            .addImporter(new PDAImporter(app, PDAGraphParser.JSON), '.pda.json', '.json');

        app.getUndoManager()
            .setEventHandlerFactory((...args) => new SafeGraphEventHandler(
                this._graphController, PDAGraphParser.JSON));

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
            .registerHotKey('Export to PNG', [CTRL_KEY, 'KeyP'], () => { app.getExportManager().tryExportFile('image-png', app.getSession()); })
            .registerHotKey('Save as JSON', [CTRL_KEY, 'KeyS'], () => { app.getExportManager().tryExportFile('session', app.getSession()); });

        this._machineController.initialize(this);
        this._graphController.initialize();
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

    /** @override */
    getModuleVersion() { return MODULE_VERSION; }
    /** @override */
    getModuleName() { return MODULE_NAME; }
    /** @override */
    getLocalizedModuleName() { return MODULE_LOCALIZED_NAME; }
    /** @override */
    getApp() { return this._app; }
}

export default PDAModule;
