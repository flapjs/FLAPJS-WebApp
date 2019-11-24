import Importer from '@flapjs/services/file/import/Importer.js';

class SessionImporter extends Importer
{
    constructor()
    {
        super();
    }

    onParseSession(session, fileData)
    {
        return fileData;
    }

    onPreImportSession(session)
    {
        session.undoService.undoManager.captureEvent();
    }

    onImportSession(session, sessionData)
    {
        
    }

    onPostImportSession(session)
    {
        session.undoService.undoManager.captureEvent();
    }

    /** @override */
    importFileData(session, fileName, fileType, fileData)
    {
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
        
        session.sessionName = projectName;

        this.onPostImportSession(session);
    }
}

export default SessionImporter;
