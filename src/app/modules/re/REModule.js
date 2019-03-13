import React from 'react';
import PanelContainer from 'experimental/panels/PanelContainer.js';

import MachineController from './MachineController.js';
import REGraphExporter from './exporter/REGraphExporter.js';
import REErrorChecker from './REErrorChecker.js';
import SafeExpressionEventHandler from './SafeExpressionEventHandler.js';

import OverviewPanel from './components/panels/overview/OverviewPanel.js';
import AnalysisPanel from './components/panels/analysis/AnalysisPanel.js';
import TestingPanel from './components/panels/testing/TestingPanel.js';

import ExpressionView from './components/views/ExpressionView.js';

const MODULE_NAME = "re";
const MODULE_VERSION = "0.0.1";
const MODULE_LOCALIZED_NAME = "RE";

class REModule
{
  constructor(app)
  {
    this._app = app;

    this._machineController = new MachineController();
    this._errorChecker = new REErrorChecker(this._machineController);

    app.getDrawerManager()
      .addPanelClass(props => (
        <PanelContainer id={props.id}
          className={props.className}
          style={props.style}
          title={"Regular Expressions"}>
          <p>{"Brought to you with \u2764 by the Flap.js team."}</p>
          <p>{"<- Tap on a tab to begin!"}</p>
        </PanelContainer>
      ))
      .addPanelClass(OverviewPanel)
      .addPanelClass(AnalysisPanel)
      .addPanelClass(TestingPanel);

    app.getViewportManager()
      .addViewClass(ExpressionView);

    app.getUndoManager()
      .setEventHandlerFactory((...args) => {
        return new SafeExpressionEventHandler(this._machineController);
      });

    app.getExportManager()
      .addExporter(new REGraphExporter());
  }

  //Override
  initialize(app)
  {
  }

  //Override
  update(app)
  {
    this._machineController.update();
  }

  //Override
  destroy(app)
  {
  }

  //Override
  clear(app)
  {
    this._machineController.setMachineExpression("");
    this._app.getToolbarComponent().closeBar();
  }

  getMachineController() { return this._machineController; }
  getErrorChecker() { return this._errorChecker; }

  //Override
  getModuleVersion() { return MODULE_VERSION; }
  //Override
  getModuleName() { return MODULE_NAME; }
  //Override
  getLocalizedModuleName() { return MODULE_LOCALIZED_NAME; }
  //Override
  getApp() { return this._app; }
}

export default REModule;
