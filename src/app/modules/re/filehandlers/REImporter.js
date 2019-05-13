import SessionImporter from 'session/SessionImporter.js';

class REImporter extends SessionImporter
{
    constructor(app)
    {
        super(app);

        this._prevExpression = '';
    }

    /** @override */
    onParseSession(session, fileData)
    {
        return JSON.parse(fileData);
    }

    /** @override */
    onPreImportSession(session)
    {
        const currentModule = session.getCurrentModule();
        const machineController = currentModule.getMachineController();
        this._prevExpression = machineController.getMachineExpression();

        // TODO: this should not be here, this should exist somewhere in graphController
        if (!this._prevExpression)
        {
            session.getApp().getUndoManager().captureEvent();
        }
    }

    /** @override */
    onImportSession(session, sessionData)
    {
        const currentModule = session.getCurrentModule();
        const machineController = currentModule.getMachineController();

        const machineExpression = sessionData['machineData']['expression'];
        if (machineExpression) machineController.setMachineExpression(machineExpression);
    }

    /** @override */
    onPostImportSession(session)
    {
        const currentModule = session.getCurrentModule();
        const machineController = currentModule.getMachineController();

        // Compares the graph hash before and after import, captures event if they are not equal
        const nextExpression = machineController.getMachineExpression();
        if (this._prevExpression !== nextExpression)
        {
            // TODO: this should not be here
            session.getApp().getUndoManager().captureEvent();
        }
    }
}

export default REImporter;
