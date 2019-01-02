export function userClearGraph(app, graphOnly=false, callback=null)
{
  if (window.confirm(I18N.toString("alert.graph.clear")))
  {
    const module = app.getCurrentModule();
    module.getGraphController().getGraph().clear();
    if (!graphOnly)
    {
      app.getUndoManager().clear();
      module.getMachineController().setMachineName(null);
    }
    if (callback) callback();
  }
}
