import React from 'react';
import PanelContainer from 'experimental/panels/PanelContainer.js';

import NodalGraphInputManager from 'modules/nodalgraph/manager/NodalGraphInputManager.js';
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
import {CTRL_KEY, ALT_KEY, SHIFT_KEY} from 'session/manager/hotkey/HotKeyManager.js';
import {RENDER_LAYER_WORKSPACE} from 'session/manager/RenderManager.js';

import FSAGraphExporter from './exporter/FSAGraphExporter.js';
import JFLAPGraphExporter from './exporter/JFLAPGraphExporter.js';
import {DEFAULT_IMAGE_EXPORTERS} from 'modules/nodalgraph/NodalGraphImageExporter.js';
import SafeGraphEventHandler from 'modules/nodalgraph/SafeGraphEventHandler.js';

import {registerNotifications} from './components/notifications/FSANotifications.js';

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

const MODULE_NAME = "fsa2";
const MODULE_VERSION = "0.0.1";

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
    this._machineController = new MachineController(this);

    this._errorChecker = new FSAErrorChecker(app,
      this._inputManager.getGraphController(),
      this._machineController);
    this._tester = new StringTester();
  }

  //Override
  initialize(app)
  {
    registerNotifications(app.getNotificationManager());

    //TODO: These should have a pre/post handlers...
    app.getExportManager()
      .addExporter(new FSAGraphExporter())
      .addExporter(new JFLAPGraphExporter())
      .addExporters(DEFAULT_IMAGE_EXPORTERS);

    app.getViewportManager()
      .addViewClass(EditPane)
      .addViewClass(TapePane);

    app.getDrawerManager()
      .addPanelClass(props => (
        <PanelContainer id={props.id}
          className={props.className}
          style={props.style}
          title={"Finite State Automata"}>
          <p>{"Brought to you with \u2764 by the Flap.js team."}</p>
          <p>{"<- Tap on a tab to begin!"}</p>
        </PanelContainer>
      ))
      .addPanelClass(OverviewPanel)
      .addPanelClass(TestingPanel)
      .addPanelClass(AnalysisPanel);

    app.getHotKeyManager()
      .registerHotKey("Export to PNG", [CTRL_KEY, 'KeyP'], () => {app.getExportManager().tryExportToFile(DEFAULT_IMAGE_EXPORTERS[0])})
      .registerHotKey("Save as JSON", [CTRL_KEY, 'KeyS'], () => {app.getExportManager().tryExportToFile(app.getExportManager().getDefaultExporter())})
      .registerHotKey("New", [CTRL_KEY, 'KeyN'], () => {this.clear(app)})
      .registerHotKey("Undo", [CTRL_KEY, 'KeyZ'], () => {app.getUndoManager().undo()})
      .registerHotKey("Redo", [CTRL_KEY, SHIFT_KEY, 'KeyZ'], () => {app.getUndoManager().redo()});

    app.getRenderManager()
      .addRenderer(RENDER_LAYER_WORKSPACE, props => (
        <>
          {/* Graph objects */
            <FSAGraphRenderer currentModule={this} parent={props.workspace}/>}
        </>
      ))
      .addRenderer(RENDER_LAYER_WORKSPACE, props => (
        <GraphInputRenderer currentModule={this}/>
      ));

    app.getUndoManager()
      .setEventHandlerFactory((...args) => {
        return new SafeGraphEventHandler(this._inputManager.getGraphController(), this._inputManager.getGraphParser());
      });

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

    this._inputManager.onSessionStart(app.getSession());
  }

  //Override
  update(app)
  {
    this._inputManager.update(this);

    const machineController = this.getMachineController();
    machineController.update(this);
  }

  //Override
  destroy(app)
  {
    this._inputManager.onSessionStop(app.getSession());

    const machineController = this.getMachineController();
    machineController.destroy(this);
  }

  //Override
  clear(app, graphOnly=false)
  {
    UserUtil.userClearGraph(app, graphOnly, () => app.getToolbarComponent().closeBar());
  }

  getInputManager() { return this._inputManager; }

  getInputController() { return this._inputManager.getInputController(); }
  getMachineController() { return this._machineController; }
  getGraphController() { return this._inputManager.getGraphController(); }

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
