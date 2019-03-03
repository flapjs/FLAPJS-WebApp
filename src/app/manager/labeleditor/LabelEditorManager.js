import React from 'react';

import LabelEditorView from './LabelEditorView.js';
import {RENDER_LAYER_WORKSPACE_OVERLAY} from 'manager/RenderManager.js';

class LabelEditorManager
{
  constructor(app)
  {
    this._app = app;

    this._labelEditorComponent = null;
    this._labelEditorRenderer = null;
    this._labeler = null;
  }

  setLabelEditorRenderer(renderer)
  {
    this._labelEditorRenderer = renderer;
    return this;
  }

  setLabeler(labeler)
  {
    this._labeler = labeler;
    return this;
  }

  //DuckType(SessionListener)
  onSessionStart(session)
  {
    const currentModule = session.getCurrentModule();
    const viewport = session.getApp().getInputAdapter().getViewport();

    const LabelEditorRenderer = this._labelEditorRenderer;
    const labeler = this._labeler;
    session.getApp().getRenderManager().addRenderer(RENDER_LAYER_WORKSPACE_OVERLAY, props => (
      <LabelEditorView ref={ref=>this._labelEditorComponent=ref}
        labeler={labeler}
        viewport={viewport}
        saveOnExit={true}>
        {/* LabelEditor objects */
          LabelEditorRenderer &&
          <LabelEditorRenderer currentModule={currentModule} parent={this._labelEditorComponent}/>}
      </LabelEditorView>
    ));
  }

  //DuckType(SessionListener)
  onSessionStop(session)
  {
    this._labeler = null;
    this._labelEditorRenderer = null;
    this._labelEditorComponent = null;
  }

  getLabelEditorComponent()
  {
    return this._labelEditorComponent;
  }
}

export default LabelEditorManager;
