import SessionSaver from './SessionSaver.js';

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
            this._importManager.tryImportFileFromData(session, '', '.json', data);
        }
    }

    /** @override */
    onSessionSave(session, dataStorage)
    {
        const currentModuleID = session.moduleID;
        this._exportManager.tryExportTargetToData('session', session)
            .then(result =>
            {
                dataStorage.setDataAsObject('graph-' + currentModuleID, result.data);
            });
    }
}

export default NodeGraphSaveHandler;
