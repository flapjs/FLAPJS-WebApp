import Importer from 'util/file/import/Importer.js';

class SessionImporter extends Importer
{
    constructor(app)
    {
        super();

        this._app = app;
    }

    onParseSession(session, fileData)
    {
        return fileData;
    }

    onPreImportSession(session)
    {
        session.getApp().getUndoManager().captureEvent();
    }

    onImportSession(session, sessionData)
    {
        
    }

    onPostImportSession(session)
    {
        session.getApp().getUndoManager().captureEvent();
    }

    /** @override */
    importFileData(fileName, fileType, fileData)
    {
        const app = this._app;
        const session = app.getSession();
        const currentModule = session.getCurrentModule();
        const result = this.onParseSession(session, fileData);

        this.onPreImportSession(session);

        this.onImportSession(session, result);

        let projectName;
        if (fileName)
        {
            projectName = fileName.substring(0, fileName.length - fileType.length);
        }
        else
        {
            projectName = result['_metadata']['name'];
        }
        
        app.getSession().setProjectName(projectName);

        this.onPostImportSession(session);

        return currentModule;
    }
}

export default SessionImporter;
