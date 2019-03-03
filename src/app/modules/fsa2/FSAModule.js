import React from 'react';
import AbstractModule from 'modules/abstract/AbstractModule.js';

import InputController from './controller/InputController.js';
import GraphController from './controller/GraphController.js';
import MachineController from './controller/MachineController.js';

import FSAGraphRenderer from './renderer/FSAGraphRenderer.js';
import FSAGraphOverlayRenderer from './renderer/FSAGraphOverlayRenderer.js';
import FSALabelEditorRenderer from './renderer/FSALabelEditorRenderer.js';

import AboutPanel from './components/panels/about/AboutPanel.js';
import OverviewPanel from './components/panels/overview/OverviewPanel.js';
import TestingPanel from './components/panels/testing/TestingPanel.js';
import AnalysisPanel from './components/panels/analysis/AnalysisPanel.js';

import Notifications from 'system/notification/Notifications.js';
import SafeGraphEventHandler from 'graph/SafeGraphEventHandler.js';
import StringTester from './tester/StringTester.js';
import FSAErrorChecker from './FSAErrorChecker.js';

import LabelEditorManager from 'manager/labeleditor/LabelEditorManager.js';
import LabelEditorView from 'manager/labeleditor/LabelEditorView.js';

import ViewportInputHandler from 'modules/abstract/ViewportInputHandler.js';

import EditPane from './components/views/EditPane.js';
import TapePane from './components/views/TapePane.js';
import {CTRL_KEY, ALT_KEY, SHIFT_KEY} from 'manager/hotkey/HotKeyManager.js';
import {RENDER_LAYER_WORKSPACE, RENDER_LAYER_WORKSPACE_OVERLAY} from 'manager/RenderManager.js';

import FSAGraphExporter from './exporter/FSAGraphExporter.js';
import JFLAPGraphExporter from './exporter/JFLAPGraphExporter.js';
import GraphImageExporter from './exporter/GraphImageExporter.js';
import { FILE_TYPE_PNG, FILE_TYPE_JPG, FILE_TYPE_SVG } from 'util/Downloader.js';

const MODULE_NAME = "fsa2";
const MODULE_VERSION = "0.0.1";

class FSAModule extends AbstractModule
{
  constructor(app)
  {
    super(app);

    this._inputController = new InputController(this, app.getInputAdapter());
    this._graphController = new GraphController(this);
    this._machineController = new MachineController(this);

    this._errorChecker = new FSAErrorChecker(this._graphController, this._machineController);
    this._tester = new StringTester();

    this._labelEditorManager = new LabelEditorManager()
      .setLabelEditorRenderer(FSALabelEditorRenderer)
      .setLabeler(this._graphController.getGraphLabeler());

    app.getInputAdapter()
      .addInputHandler(this._inputController)
      .addInputHandler(new ViewportInputHandler());

    app.getExportManager()
      .addExporter(new FSAGraphExporter())
      .addExporter(new JFLAPGraphExporter())
      .addExporter(new GraphImageExporter(FILE_TYPE_PNG))
      .addExporter(new GraphImageExporter(FILE_TYPE_JPG))
      .addExporter(new GraphImageExporter(FILE_TYPE_SVG));

    app.getViewportManager()
      .addViewClass(EditPane)
      .addViewClass(TapePane);

    app.getDrawerManager()
      .addPanelClass(AboutPanel)
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
          {/* Graph overlays */
            <FSAGraphOverlayRenderer currentModule={this} parent={props.workspace}/>}
        </>
      ));

    app.getUndoManager()
      .setEventHandlerFactory((args) => {
        return new SafeGraphEventHandler(this._graphController);
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
