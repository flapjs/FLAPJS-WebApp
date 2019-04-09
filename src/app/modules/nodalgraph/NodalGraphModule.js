import React from 'react';
import PanelContainer from 'experimental/panels/PanelContainer.js';

import NodalGraphInputManager from 'modules/nodalgraph/manager/NodalGraphInputManager.js';

import NodalGraphRenderer from 'graph/renderer/NodalGraphRenderer.js';
import GraphInputRenderer from 'modules/nodalgraph/controller/renderer/GraphInputRenderer.js';

import NodalGraph from 'graph/NodalGraph.js';
import GraphNode from 'graph/GraphNode.js';
import QuadraticEdge from 'graph/QuadraticEdge.js';
import EmptyGraphLabeler from './EmptyGraphLabeler.js';
import * as NodalGraphParser from 'graph/parser/NodalGraphParser.js';

import EditPane from './components/views/EditPane.js';
import {RENDER_LAYER_WORKSPACE} from 'session/manager/RenderManager.js';

import NodalGraphExporter from './NodalGraphExporter.js';
import {DEFAULT_IMAGE_EXPORTERS} from './NodalGraphImageExporter.js';
import SafeGraphEventHandler from './SafeGraphEventHandler.js';

import * as UserUtil from 'experimental/UserUtil.js';

const MODULE_NAME = "nodalgraph";
const MODULE_VERSION = "0.0.1";
const MODULE_LOCALIZED_NAME = "NodalGraph";

class NodalGraphModule
{
  constructor(app)
  {
    this._app = app;

    this._inputManager = new NodalGraphInputManager(this,
      new NodalGraph(GraphNode, QuadraticEdge),
      new EmptyGraphLabeler(),
      NodalGraphParser,
      null);

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

    app.getViewportManager()
      .addViewClass(EditPane);

    app.getRenderManager()
      .addRenderer(RENDER_LAYER_WORKSPACE, props => (
        <>
          {/* Graph objects */
            <NodalGraphRenderer currentModule={this} parent={props.workspace}/>}
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
    this._inputManager.onSessionStart(app.getSession());
  }

  //Override
  update(app)
  {
    this._inputManager.update(this);
  }

  //Override
  destroy(app)
  {
    this._inputManager.onSessionStop(app.getSession());
  }

  //Override
  clear(app, graphOnly=false)
  {
    UserUtil.userClearGraph(app, graphOnly, () => app.getToolbarComponent().closeBar());
  }

  getInputManager() { return this._inputManager; }
  getInputController() { return this._inputManager.getInputController(); }
  getGraphController() { return this._inputManager.getGraphController(); }

  //Override
  getModuleVersion() { return MODULE_VERSION; }
  //Override
  getModuleName() { return MODULE_NAME; }
  //Override
  getLocalizedModuleName() { return MODULE_LOCALIZED_NAME; }

  getApp() { return this._app; }
}

export default NodalGraphModule;
