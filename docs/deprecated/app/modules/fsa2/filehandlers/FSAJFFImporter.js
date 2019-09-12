import SessionImporter from 'session/SessionImporter.js';

class FSAJFFImporter extends SessionImporter
{
    constructor(app, jffGraphParser)
    {
        super();

        this._app = app;
        this._graphParser = jffGraphParser;
    }

    /** @override */
    onParseSession(session, fileData)
    {
        return new DOMParser().parseFromString(fileData, 'text/xml');
    }

    /** @override */
    onPreImportSession(session)
    {
        const currentModule = session.getCurrentModule();
        const graphController = currentModule.getGraphController();
        const graph = graphController.getGraph();
        this._prevGraphHash = graph.getHashCode(true);

        // TODO: this should not be here, this should exist somewhere in graphController
        if (!graph.isEmpty())
        {
            session.getApp().getUndoManager().captureEvent();
        }
    }

    /** @override */
    onImportSession(session, sessionData)
    {
        const currentModule = session.getCurrentModule();
        const graphController = currentModule.getGraphController();
        const graph = graphController.getGraph();

        this._graphParser.parse(sessionData, graph);
    }

    /** @override */
    onPostImportSession(session)
    {
        const currentModule = session.getCurrentModule();
        const graphController = currentModule.getGraphController();
        const graph = graphController.getGraph();

        // Compares the graph hash before and after import, captures event if they are not equal
        const nextGraphHash = graph.getHashCode(true);
        if (this._prevGraphHash !== nextGraphHash)
        {
            // TODO: this should not be here
            session.getApp().getUndoManager().captureEvent();
        }
    }
}

export default FSAJFFImporter;
