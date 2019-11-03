import SessionSaver from '@flapjs/session/helper/SessionSaver.js';

class NodeGraphSaveHandler extends SessionSaver
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
        if (data)
        {
            session.importManager.tryImportFileFromData(session, '', '.json', data);
        }
    }

    /** @override */
    onSessionSave(session, dataStorage)
    {
        const currentModuleID = session.moduleID;
        session.exportManager.tryExportTargetToData('session', session)
            .then(result =>
            {
                dataStorage.setDataAsObject('graph-' + currentModuleID, result.data);
            });
    }
}

export default NodeGraphSaveHandler;
