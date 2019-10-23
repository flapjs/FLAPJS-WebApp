import SessionImporter from '@flapjs/modules/base/SessionImporter.js';

class NodeGraphImporter extends SessionImporter
{
    constructor(jsonGraphParser)
    {
        super();

        this._graphParser = jsonGraphParser;
        this._prevGraphHash = 0;
    }

    /** @override */
    onParseSession(session, fileData)
    {
        return JSON.parse(fileData);
    }

    /** @override */
    onPreImportSession(session)
    {
        const graphController = session.graphController;
        const graph = graphController.getGraph();
        this._prevGraphHash = graph.getHashCode(true);

        // TODO: this should not be here, this should exist somewhere in graphController
        if (!graph.isEmpty())
        {
            session.undoManager.captureEvent();
        }
    }

    /** @override */
    onImportSession(session, sessionData)
    {
        const graphController = session.graphController;
        const graph = graphController.getGraph();

        this._graphParser.parse(sessionData['graphData'], graph);
    }

    /** @override */
    onPostImportSession(session)
    {
        const graphController = session.graphController;
        const graph = graphController.getGraph();

        // Compares the graph hash before and after import, captures event if they are not equal
        const nextGraphHash = graph.getHashCode(true);
        if (this._prevGraphHash !== nextGraphHash)
        {
            // TODO: this should not be here
            session.undoManager.captureEvent();
        }
    }
}

export default NodeGraphImporter;
