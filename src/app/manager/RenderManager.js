export const RENDER_LAYER_WORKSPACE = "workspace";
export const RENDER_LAYER_WORKSPACE_OVERLAY = "workspace_overlay";
export const RENDER_LAYER_LABELEDITOR = "labeleditor";
export const RENDER_LAYER_VIEWPORT = "viewport";

class RenderManager
{
  constructor()
  {
    this._renderMapping = new Map();
  }

  registerRenderer(layerID, rendererClass)
  {
    this._renderMapping.set(layerID, rendererClass);
    return this;
  }

  //DuckType(SessionListener)
  onSessionStart(session)
  {

  }

  //DuckType(SessionListener)
  onSessionStop(session)
  {
    this._renderMapping.clear();
  }

  getRendererByLayer(layerID)
  {
    return this._renderMapping.get(layerID);
  }
}

export default RenderManager;
