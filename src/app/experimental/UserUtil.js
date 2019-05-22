/**
 * @module UserUtil
 * @desc Contains utility functions for user-related actions.
 */

/**
 * Clears the graph with user-prompts.
 * @param {*} app the current app.
 * @param {*} graphOnly whether to only clear the graph only.
 * @param {*} callback a callback for when it is done.
 */
export function userClearGraph(app, graphOnly=false, callback=null)
{
    if (window.confirm(I18N.toString('alert.graph.clear')))
    {
        const module = app.getCurrentModule();
        module.getGraphController().getGraph().clear();
        if (!graphOnly)
        {
            app.getUndoManager().clear();
            app.getSession().setProjectName(null);
        }
        else
        {
            app.getUndoManager().captureEvent();
        }
        if (callback) callback();
    }
}
