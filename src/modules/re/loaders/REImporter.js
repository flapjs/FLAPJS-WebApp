import SessionImporter from '@flapjs/session/loaders/SessionImporter.js';

/**
 * A class that represents a session importer for the RE module.
 */
class REImporter extends SessionImporter
{
    constructor(fileTypes = [])
    {
        super();

        this._prevExpression = '';
        this._fileTypes = fileTypes;
    }

    /** @override */
    onParseSession(session, fileData)
    {
        return JSON.parse(fileData);
    }

    /** @override */
    onPreImportSession(session)
    {
        const machineController = session.machineService.machineController;
        this._prevExpression = machineController.getMachine().getExpression();

        // TODO: this should not be here, this should exist somewhere in graphController
        if (!this._prevExpression)
        {
            session.undoManager.captureEvent();
        }
    }

    /** @override */
    onImportSession(session, sessionData)
    {
        const machineController = session.machineService.machineController;

        const machineExpression = sessionData['machineData']['expression'];
        if (machineExpression) machineController.getMachine().setExpression(machineExpression);
    }

    /** @override */
    onPostImportSession(session)
    {
        const machineController = session.machineService.machineController;

        // Compares the graph hash before and after import, captures event if they are not equal
        const nextExpression = machineController.getMachine().getExpression();
        if (this._prevExpression !== nextExpression)
        {
            // TODO: this should not be here
            session.undoManager.captureEvent();
        }
    }

    /** @override */
    getFileTypes()
    {
        return this._fileTypes;
    }
}

export default REImporter;
