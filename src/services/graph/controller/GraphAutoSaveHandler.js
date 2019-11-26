import SessionSaver from '@flapjs/session/loaders/SessionSaver.js';

class GraphAutoSaveHandler extends SessionSaver
{
    constructor(session)
    {
        super(session);
    }

    /** @override */
    onSessionLoad(session, dataStorage)
    {
        const currentModuleID = session.moduleID;
        const data = dataStorage.getDataAsObject('graph-' + currentModuleID);
        if (data && session.importManager)
        {
            session.importManager.tryImportFileFromData(session, '', '.json', data);
        }
    }

    /** @override */
    onSessionSave(session, dataStorage)
    {
        const currentModuleID = session.moduleID;
        if (session.exportManager)
        {
            session.exportManager.tryExportTargetToData('session', session)
                .then(result =>
                {
                    dataStorage.setDataAsObject('graph-' + currentModuleID, result.data);
                });
        }
    }
}

export default GraphAutoSaveHandler;
