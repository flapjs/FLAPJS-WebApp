import React from 'react';
import PanelContainer from 'experimental/panels/PanelContainer.js';

import AbstractModule from 'modules/abstract/AbstractModule.js';

import InputController from 'modules/nodalgraph/controller/InputController.js';
import GraphController from 'modules/nodalgraph/controller/GraphController.js';
import SelectionBoxInputHandler from 'modules/nodalgraph/controller/SelectionBoxInputHandler.js';
import ViewportInputHandler from 'modules/nodalgraph/controller/ViewportInputHandler.js';

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

import Notifications from 'system/notification/Notifications.js';
import StringTester from './tester/StringTester.js';
import PDAErrorChecker from './PDAErrorChecker.js';

import LabelEditorManager from 'manager/labeleditor/LabelEditorManager.js';

import EditPane from './components/views/EditPane.js';
import TapePane from './components/views/TapePane.js';
import {CTRL_KEY, ALT_KEY, SHIFT_KEY} from 'manager/hotkey/HotKeyManager.js';
import {RENDER_LAYER_WORKSPACE} from 'manager/RenderManager.js';

import PDAGraphExporter from './exporter/PDAGraphExporter.js';
import {DEFAULT_IMAGE_EXPORTERS} from 'modules/nodalgraph/NodalGraphImageExporter.js';
import SafeGraphEventHandler from 'modules/nodalgraph/SafeGraphEventHandler.js';

const MODULE_NAME = "pda";
const MODULE_LOCALIZED_NAME = "PDA";
const MODULE_VERSION = "0.0.1";

class PDAModule extends AbstractModule
{
  constructor(app)
  {
    super(app);

    this._inputController = new InputController(this, app.getInputAdapter());
    this._graphController = new GraphController(this, new PDAGraph(), new PDAGraphLabeler(), PDAGraphParser);
    this._machineController = new MachineController(this);

    this._errorChecker = new PDAErrorChecker(this._graphController, this._machineController);
    this._tester = new StringTester();

    this._labelEditorManager = new LabelEditorManager()
      .setLabelEditorRenderer(PDALabelEditorRenderer)
      .setLabeler(this._graphController.getGraphLabeler());

    app.getInputAdapter()
      .addInputHandler(this._inputController)
      .addInputHandler(new SelectionBoxInputHandler(this._inputController, this._graphController, this._inputController.getSelectionBox()))
      .addInputHandler(new ViewportInputHandler());

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
  getGraphController() { return this._graphController; }
  getMachineController() { return this._machineController; }

  //Override
  getModuleVersion() { return MODULE_VERSION; }
  //Override
  getModuleName() { return MODULE_NAME; }
  //Override
  getLocalizedModuleName() { return MODULE_LOCALIZED_NAME; }
}

export default PDAModule;
