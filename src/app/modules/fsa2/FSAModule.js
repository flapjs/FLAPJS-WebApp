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
import {CTRL_KEY, ALT_KEY, SHIFT_KEY} from 'manager/hotkey/HotKeyManager.js';
import {RENDER_LAYER_WORKSPACE} from 'manager/RenderManager.js';

import FSAGraphExporter from './exporter/FSAGraphExporter.js';
import JFLAPGraphExporter from './exporter/JFLAPGraphExporter.js';
import {DEFAULT_IMAGE_EXPORTERS} from 'modules/nodalgraph/NodalGraphImageExporter.js';
import SafeGraphEventHandler from 'modules/nodalgraph/SafeGraphEventHandler.js';

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
    this._machineController = new MachineController(this);

    this._errorChecker = new FSAErrorChecker(
      this._inputManager.getGraphController(),
      this._machineController);
    this._tester = new StringTester();
  }

  //Override
  initialize(app)
  {
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
      .registerHotKey("Export to PNG", [CTRL_KEY, 'KeyP'], () => {console.log("Export!")})
      .registerHotKey("Save as JSON", [CTRL_KEY, 'KeyS'], () => {console.log("Save!")})
      .registerHotKey("New", [CTRL_KEY, 'KeyN'], () => {console.log("New!")})
      .registerHotKey("Undo", [CTRL_KEY, 'KeyZ'], () => {console.log("Undo!")})
      .registerHotKey("Redo", [CTRL_KEY, SHIFT_KEY, 'KeyZ'], () => {console.log("Redo!")});

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
  clear(app)
  {
    UserUtil.userClearGraph(app, false, () => app.getToolbarComponent().closeBar());
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
