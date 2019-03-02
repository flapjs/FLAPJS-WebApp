export function userClearGraph(app, graphOnly=false, callback=null)
{
  if (window.confirm(I18N.toString("alert.graph.clear")))
  {
    const module = app.getCurrentModule();
    module.getGraphController().getGraph().clear();
    if (!graphOnly)
    {
      app.getUndoManager().clear();
      app.getSession().setProjectName(null);
    }
    if (callback) callback();
  }
}
