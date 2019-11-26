import SessionImporter from '@flapjs/session/loaders/SessionImporter.js';
import { INSTANCE as JFF_PARSER } from '@flapjs/modules/fa/loaders/JFFGraphParser.js';

class JFFImporter extends SessionImporter
{
    constructor(fileTypes = [])
    {
        super();

        this._prevGraphHash = 0;

        this._fileTypes = fileTypes;
    }

    /** @override */
    onParseSession(session, fileData)
    {
        return new DOMParser().parseFromString(fileData, 'text/xml');
    }

    /** @override */
    onPreImportSession(session)
    {
        const graphController = session.graphService.graphController;
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
        const graphController = session.graphService.graphController;
        const graph = graphController.getGraph();

        JFF_PARSER.parse(sessionData, graph);
    }

    /** @override */
    onPostImportSession(session)
    {
        const graphController = session.graphService.graphController;
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

export default JFFImporter;
