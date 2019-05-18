import React from 'react';

import { userClearGraph } from 'experimental/UserUtil.js';
import { CTRL_KEY, SHIFT_KEY } from 'session/manager/hotkey/HotKeyManager.js';
import { RENDER_LAYER_WORKSPACE } from 'session/manager/RenderManager.js';

import FSAGraph from './graph/FSAGraph.js';
import FSAGraphController from './graph/FSAGraphController.js';
import MachineController from './controller/MachineController.js';

import StringTester from './tester/StringTester.js';
import FSAErrorChecker from './FSAErrorChecker.js';
import { registerNotifications } from './components/notifications/FSANotifications.js';

import * as FSAGraphParser from 'modules/fsa/graph/FSAGraphParser.js';
import FSAImporter from './filehandlers/FSAImporter.js';
import FSAJFFImporter from './filehandlers/FSAJFFImporter.js';
import FSAExporter from './filehandlers/FSAExporter.js';
import FSAJFFExporter from './filehandlers/FSAJFFExporter.js';
import { registerImageExporters } from 'modules/nodalgraph/filehandlers/NodalGraphImageExporter.js';

import SafeGraphEventHandler from 'modules/nodalgraph/SafeGraphEventHandler.js';

import FSABroadcastHandler from './FSABroadcastHandler.js';

/* COMPONENTS */

import PanelContainer from 'experimental/panels/PanelContainer.js';

import OverviewPanel from './components/panels/overview/OverviewPanel.js';
import TestingPanel from './components/panels/testing/TestingPanel.js';
import AnalysisPanel from './components/panels/analysis/AnalysisPanel.js';

import FSANodeRenderer from './graph/renderer/FSANodeRenderer.js';
import FSANodeInputHandler from './graph/inputhandler/FSANodeInputHandler.js';
import FSAInitialMarkerLayer from './graph/renderer/FSAInitialMarkerLayer.js';
import FSALabelEditorRenderer from './renderer/FSALabelEditorRenderer.js';

import GraphView from 'graph2/components/GraphView.js';
import GraphNodeLayer from 'graph2/components/layers/GraphNodeLayer.js';
import GraphEdgeLayer from 'graph2/components/layers/GraphEdgeLayer.js';
import SelectionBoxLayer from 'graph2/components/layers/SelectionBoxLayer.js';
import ViewportLayer from 'graph2/components/layers/ViewportLayer.js';
import ViewportNavigationLayer from 'graph2/components/layers/ViewportNavigationLayer.js';
import LabelEditorView from 'graph2/components/views/LabelEditorView.js';

const MODULE_NAME = 'fsa2';
const MODULE_VERSION = '0.0.1';

class FSAModule
{
    constructor(app)
    {
        this._app = app;

        this._graph = new FSAGraph();
        this._graphController = new FSAGraphController(app, this._graph, null);
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
                            <FSAInitialMarkerLayer
                                inputController={graphView.getInputController()}
                                graphController={graphController}
                                inputContext={graphView.getInputContext()}
                                inputPriority={-1} />
                            <GraphNodeLayer
                                nodes={graph.getNodes()}
                                inputController={graphView.getInputController()}
                                graphController={graphController}
                                nodeRenderer={FSANodeRenderer}
                                inputContext={graphView.getInputContext()}
                                inputPriority={-1} />
                            <GraphEdgeLayer
                                ref={ref =>
                                {
                                    if (!ref) return;
                                    ref.getGraphEdgeInputHandler()
                                        .setShouldDeleteEdgeWithEmptyLabel(true)
                                        .setShouldDeleteEdgePlaceholder(true);
                                }}
                                edges={graph.getEdges()}
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
                            <ViewportLayer
                                graphController={graphController}
                                inputController={graphView.getInputController()}
                                viewport={graphView.getViewportComponent()}>
                                <ViewportNavigationLayer
                                    style={{ right: 0 }}
                                    viewportAdapter={graphView.getViewportComponent().getViewportAdapter()} />
                            </ViewportLayer>
                            <LabelEditorView ref={ref => graphController.setLabelEditor(ref)}
                                labelFormatter={labelFormatter}
                                viewport={graphView.getViewportComponent()}
                                saveOnExit={true}>
                                <FSALabelEditorRenderer graphController={graphController} currentModule={this} />
                            </LabelEditorView>
                        </React.Fragment>
                    )}>
                </GraphView>
            ));

        this._machineController = new MachineController(this);

        this._errorChecker = new FSAErrorChecker(app,
            this._graphController,
            this._machineController);
        this._tester = new StringTester();

        this._broadcastHandler = new FSABroadcastHandler();
    }

    /** @override */
    initialize(app)
    {
        const graphView = this._graphViewComponent.current;
        const inputController = graphView.getInputController();
        const inputContext = graphView.getInputContext();
        const graphController = this._graphController;
        inputContext.addInputHandler(new FSANodeInputHandler(inputController, graphController));

        registerNotifications(app.getNotificationManager());

        //TODO: These should have a pre/post handlers...
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
    getLocalizedModuleName() { return this._machineController.getMachineType(); }
    getApp() { return this._app; }
}

export default FSAModule;
