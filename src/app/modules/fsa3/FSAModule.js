import React from 'react';
import PanelContainer from 'experimental/panels/PanelContainer.js';

import MachineController from './controller/MachineController.js';

import OverviewPanel from './components/panels/overview/OverviewPanel.js';
import TestingPanel from './components/panels/testing/TestingPanel.js';
import AnalysisPanel from './components/panels/analysis/AnalysisPanel.js';

import StringTester from './tester/StringTester.js';
import FSAErrorChecker from './FSAErrorChecker.js';

import EditPane from './components/views/EditPane.js';
import TapePane from './components/views/TapePane.js';
import { CTRL_KEY, SHIFT_KEY } from 'session/manager/hotkey/HotKeyManager.js';

import FSAGraphExporter from './exporter/FSAGraphExporter.js';
import JFLAPGraphExporter from './exporter/JFLAPGraphExporter.js';
import { DEFAULT_IMAGE_EXPORTERS } from 'modules/nodalgraph/exporter/NodalGraphImageExporter.js';

import { registerNotifications } from './components/notifications/FSANotifications.js';





import * as UserUtil from 'experimental/UserUtil.js';
import { RENDER_LAYER_WORKSPACE } from 'session/manager/RenderManager.js';
import GraphEditorView from 'graph/components/views/GraphEditorView.js';

import FSAGraph from './graph/FSAGraph.js';
import FSAGraphController from './graph/controller/FSAGraphController.js';




const MODULE_NAME = 'fsa3';
const MODULE_VERSION = '0.0.1';

class FSAModule
{
    constructor(app)
    {
        this._app = app;

        this._graph = new FSAGraph();
        this._graphController = new FSAGraphController(app, this._graph);

        this._machineController = new MachineController(this);

        this._errorChecker = new FSAErrorChecker(app,
            this._graphController,
            this._machineController);
        this._tester = new StringTester();
    }

    //Override
    initialize(app)
    {
        registerNotifications(app.getNotificationManager());

        app.getExportManager()
            .addExporter(new FSAGraphExporter())
            .addExporter(new JFLAPGraphExporter())
            .addExporters(DEFAULT_IMAGE_EXPORTERS);

        app.getRenderManager()
            .addRenderer(RENDER_LAYER_WORKSPACE, props => (
                <GraphEditorView graphController={this._graphController} />
            ));

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
        /*
      /*
    app.getViewportManager()
      .addViewClass(EditPane)
      .addViewClass(TapePane)
      .addViewClass(StepTracerView);
      */

        /*

    app.getHotKeyManager()
      .registerHotKey("Export to PNG", [CTRL_KEY, 'KeyP'], () => { app.getExportManager().tryExportToFile(DEFAULT_IMAGE_EXPORTERS[0]) })
      .registerHotKey("Save as JSON", [CTRL_KEY, 'KeyS'], () => { app.getExportManager().tryExportToFile(app.getExportManager().getDefaultExporter()) })
      .registerHotKey("New", [CTRL_KEY, 'KeyN'], () => { this.clear(app) })
      .registerHotKey("Undo", [CTRL_KEY, 'KeyZ'], () => { app.getUndoManager().undo() })
      .registerHotKey("Redo", [CTRL_KEY, SHIFT_KEY, 'KeyZ'], () => { app.getUndoManager().redo() });

    app.getTooltipManager()
      .addTooltip(I18N.toString("message.workspace.empty"))
      .addTooltip("If you need help, try the \'?\' at the top.")
      .addTooltip("Or you can choose to do nothing.")
      .addTooltip("I can't do anything about that.")
      .addTooltip("You really should consider doing something though, for the sake of both of us.")
      .addTooltip("Of course, it is your free will.")
      .addTooltip("You do you.")
      .addTooltip("Please do something.")
      .addTooltip("I need my job.")
      .addTooltip(I18N.toString("message.workspace.empty"));

    const machineController = this.getMachineController();
    machineController.initialize(this);
    */
    }

    //Override
    update(app)
    {
        const machineController = this.getMachineController();
        machineController.update(this);
    }

    //Override
    destroy(app)
    {
        const machineController = this.getMachineController();
        machineController.destroy(this);
    }

    //Override
    clear(app, graphOnly = false)
    {
        UserUtil.userClearGraph(app, graphOnly, () => app.getToolbarComponent().closeBar());
    }

    getGraphController() { return this._graphController; }
    getLabelFormatter() { return this._labelFormatter; }
    getGraph() { return this._graph; }

    getMachineController() { return this._machineController; }

    getErrorChecker() { return this._errorChecker; }
    getStringTester() { return this._tester; }

    //Override
    getModuleVersion() { return MODULE_VERSION; }
    //Override
    getModuleName() { return MODULE_NAME; }
    //Override
    getLocalizedModuleName() { return this._machineController.getMachineType(); }
    getApp() { return this._app; }
}

export default FSAModule;
