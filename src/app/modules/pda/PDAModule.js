import React from 'react';
import PanelContainer from 'experimental/panels/PanelContainer.js';

import AbstractModule from 'modules/abstract/AbstractModule.js';

import NodalGraphInputManager from 'modules/nodalgraph/manager/NodalGraphInputManager.js';
import MachineController from './controller/MachineController.js';

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
import {CTRL_KEY, ALT_KEY, SHIFT_KEY} from 'manager/hotkey/HotKeyManager.js';
import {RENDER_LAYER_WORKSPACE} from 'manager/RenderManager.js';

import PDAGraphExporter from './exporter/PDAGraphExporter.js';
import {DEFAULT_IMAGE_EXPORTERS} from 'modules/nodalgraph/NodalGraphImageExporter.js';
import SafeGraphEventHandler from 'modules/nodalgraph/SafeGraphEventHandler.js';

import * as UserUtil from 'experimental/UserUtil.js';

const MODULE_NAME = "pda";
const MODULE_LOCALIZED_NAME = "PDA";
const MODULE_VERSION = "0.0.1";

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
    this._machineController = new MachineController(this);

    this._errorChecker = new PDAErrorChecker(
      this._inputManager.getGraphController(),
      this._machineController);
    this._tester = new StringTester();

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
          title={"Pushdown Automata"}>
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
            <PDAGraphRenderer currentModule={this} parent={props.workspace}/>}
        </>
      ))
      .addRenderer(RENDER_LAYER_WORKSPACE, props => (
        <GraphInputRenderer currentModule={this}/>
      ));

    app.getUndoManager()
      .setEventHandlerFactory((...args) => {
        return new SafeGraphEventHandler(this._inputManager.getGraphController(), this._inputManager.getGraphParser());
      });
  }

  //Override
  initialize(app)
  {
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
  getLocalizedModuleName() { return MODULE_LOCALIZED_NAME; }
  getApp() { return this._app; }
}

export default PDAModule;
