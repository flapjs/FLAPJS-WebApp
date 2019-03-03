import React from 'react';
import PanelContainer from 'experimental/panels/PanelContainer.js';

import AbstractModule from 'modules/abstract/AbstractModule.js';

import InputController from 'modules/nodalgraph/controller/InputController.js';
import GraphController from 'modules/nodalgraph/controller/GraphController.js';
import SelectionBoxInputHandler from 'modules/nodalgraph/controller/SelectionBoxInputHandler.js';
import ViewportInputHandler from 'modules/nodalgraph/controller/ViewportInputHandler.js';

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

import Notifications from 'system/notification/Notifications.js';
import StringTester from './tester/StringTester.js';
import FSAErrorChecker from './FSAErrorChecker.js';

import LabelEditorManager from 'manager/labeleditor/LabelEditorManager.js';

import EditPane from './components/views/EditPane.js';
import TapePane from './components/views/TapePane.js';
import {CTRL_KEY, ALT_KEY, SHIFT_KEY} from 'manager/hotkey/HotKeyManager.js';
import {RENDER_LAYER_WORKSPACE} from 'manager/RenderManager.js';

import FSAGraphExporter from './exporter/FSAGraphExporter.js';
import JFLAPGraphExporter from './exporter/JFLAPGraphExporter.js';
import {DEFAULT_IMAGE_EXPORTERS} from 'modules/nodalgraph/NodalGraphImageExporter.js';
import SafeGraphEventHandler from 'modules/nodalgraph/SafeGraphEventHandler.js';

const MODULE_NAME = "fsa2";
const MODULE_VERSION = "0.0.1";

class FSAModule extends AbstractModule
{
  constructor(app)
  {
    super(app);

    this._inputController = new InputController(this, app.getInputAdapter());
    this._graphController = new GraphController(this, new FSAGraph(), new FSAGraphLabeler(), FSAGraphParser);
    this._machineController = new MachineController(this);

    this._errorChecker = new FSAErrorChecker(this._graphController, this._machineController);
    this._tester = new StringTester();

    this._labelEditorManager = new LabelEditorManager()
      .setLabelEditorRenderer(FSALabelEditorRenderer)
      .setLabeler(this._graphController.getGraphLabeler());

    app.getInputAdapter()
      .addInputHandler(this._inputController)
      .addInputHandler(new SelectionBoxInputHandler(this._inputController, this._graphController, this._inputController.getSelectionBox()))
      .addInputHandler(new ViewportInputHandler());

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
        return new SafeGraphEventHandler(this._graphController, this._graphController.getGraphParser());
      });
  }

  //Override
  initialize(app)
  {
    super.initialize(app);

    this._labelEditorManager.onSessionStart(app.getSession());

    //Notify on create in delete mode
    const tryCreateWhileTrash = () => {
      if (this._inputController.isTrashMode())
      {
        Notifications.addMessage(I18N.toString("message.warning.cannotmodify"), "warning", "tryCreateWhileTrash");
      }
    };
    this._graphController.on("tryCreateWhileTrash", tryCreateWhileTrash);
  }

  //Override
  destroy(app)
  {
    super.destroy(app);

    this._labelEditorManager.onSessionStop(app.getSession());
  }

  getLabelEditorManager() { return this._labelEditorManager; }

  getInputController() { return this._inputController; }
  getMachineController() { return this._machineController; }
  getGraphController() { return this._graphController; }

  //Override
  getModuleVersion() { return MODULE_VERSION; }
  //Override
  getModuleName() { return MODULE_NAME; }
  //Override
  getLocalizedModuleName() { return this._machineController.getMachineType(); }
}

export default FSAModule;
