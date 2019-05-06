import React from 'react';

import LabelEditorView from './LabelEditorView.js';
import {RENDER_LAYER_WORKSPACE_OVERLAY} from 'session/manager/RenderManager.js';

class LabelEditorManager
{
  constructor(app)
  {
    this._app = app;

    this._labelEditorComponent = React.createRef();
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
    const viewport = session.getApp().getInputAdapter().getViewportAdapter();

    const LabelEditorRenderer = this._labelEditorRenderer;
    const labeler = this._labeler;

    session.getApp().getRenderManager().addRenderer(RENDER_LAYER_WORKSPACE_OVERLAY, props => (
      <LabelEditorView ref={this._labelEditorComponent}
        labeler={labeler}
        viewport={viewport}
        saveOnExit={true}>
        {/* LabelEditor objects */
          LabelEditorRenderer &&
          <LabelEditorRenderer currentModule={currentModule} parent={this._labelEditorComponent.current}/>}
      </LabelEditorView>
    ));
  }

  //DuckType(SessionListener)
  onSessionStop(session)
  {
    this._labeler = null;
    this._labelEditorRenderer = null;
  }

  getLabelEditorComponent()
  {
    return this._labelEditorComponent.current;
  }
}

export default LabelEditorManager;
