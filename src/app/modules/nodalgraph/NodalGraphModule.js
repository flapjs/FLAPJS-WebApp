import React from 'react';
import PanelContainer from 'experimental/panels/PanelContainer.js';

import NodalGraphController from './NodalGraphController.js';
import NodalGraphExporter from './NodalGraphExporter.js';
import {DEFAULT_IMAGE_EXPORTERS} from './NodalGraphImageExporter.js';
import SafeGraphEventHandler from './SafeGraphEventHandler.js';

import NodalGraph from 'graph/NodalGraph.js';
import GraphNode from 'graph/GraphNode.js';
import QuadraticEdge from 'graph/QuadraticEdge.js';

import {JSON as JSONGraphParser} from 'graph/parser/NodalGraphParser.js';

const MODULE_NAME = "nodalgraph";
const MODULE_VERSION = "0.0.1";
const MODULE_LOCALIZED_NAME = "NodalGraph";

class NodalGraphModule
{
  constructor(app)
  {
    this._app = app;

    this._graphController = new NodalGraphController(this, new NodalGraph(GraphNode, QuadraticEdge));
    this._graphParser = JSONGraphParser;

    app.getDrawerManager()
      .addPanelClass(props => (
        <PanelContainer id={props.id}
          className={props.className}
          style={props.style}
          title={"Your Average Graph Editor"}>
          <p>{"Brought to you with \u2764 by the Flap.js team."}</p>
          <p>{"<- Tap on a tab to begin!"}</p>
        </PanelContainer>
      ));

    app.getExportManager()
      .addExporter(new NodalGraphExporter())
      .addExporters(DEFAULT_IMAGE_EXPORTERS);

    app.getUndoManager()
      .setEventHandlerFactory((...args) => {
        return new SafeGraphEventHandler(this._graphController, this._graphParser);
      });
  }

  //Override
  initialize(app)
  {
  }

  //Override
  update(app)
  {
  }

  //Override
  destroy(app)
  {
  }

  getGraphParser() { return this._graphParser; }
  getGraphController() { return this._graphController; }
  getInputController() { return this._inputController; }

  //Override
  getModuleVersion() { return MODULE_VERSION; }
  //Override
  getModuleName() { return MODULE_NAME; }
  //Override
  getLocalizedModuleName() { return MODULE_LOCALIZED_NAME; }

  getApp() { return this._app; }
}

export default NodalGraphModule;
