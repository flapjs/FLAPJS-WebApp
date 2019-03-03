export const RENDER_LAYER_WORKSPACE = "workspace";
export const RENDER_LAYER_WORKSPACE_OVERLAY = "workspace-overlay";
export const RENDER_LAYER_VIEWPORT = "viewport";
export const RENDER_LAYER_VIEWPORT_OVERLAY = "viewport-overlay";

class RenderManager
{
  constructor()
  {
    this._renderMapping = new Map();
  }

  addRenderer(layerID, rendererClass)
  {
    if (this._renderMapping.has(layerID))
    {
      this._renderMapping.get(layerID).push(rendererClass);
    }
    else
    {
      this._renderMapping.set(layerID, [rendererClass]);
    }
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

  getRenderersByLayer(layerID)
  {
    return this._renderMapping.get(layerID);
  }
}

export default RenderManager;
