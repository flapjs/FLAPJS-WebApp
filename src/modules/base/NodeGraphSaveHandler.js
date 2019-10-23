import AbstractAutoSaveHandler from '@flapjs/deprecated/autosave/AbstractAutoSaveHandler';

class NodeGraphSaveHandler extends AbstractAutoSaveHandler
{
    constructor(session, importManager, exportManager)
    {
        super();
        
        this._session = session;
        this._importManager = importManager;
        this._exportManager = exportManager;
    }

    /** @override */
    onAutoSaveLoad(dataStorage)
    {
        const currentModule = this._session.module;
        const currentModuleID = currentModule.id;

        const data = dataStorage.getDataAsObject('graph-' + currentModuleID);
        if (data)
        {
            try
            {
                this.importManager.tryImportFileFromData(this._session, '', '.json', data);
            }
            catch(e)
            {
                // Ignore error
            }
        }
    }

    /** @override */
    onAutoSaveUpdate(dataStorage)
    {
        const currentModuleID = this._session.moduleID;

        try
        {
            this._exportManager.tryExportTargetToData('session', this._session)
                .then(result =>
                {
                    dataStorage.setDataAsObject('graph-' + currentModuleID, result.data);
                });
        }
        catch(e)
        {
            // Ignore error
        }
    }

    /** @override */
    onAutoSaveUnload(dataStorage)
    {
        //Don't do anything...
    }
}

export default NodeGraphSaveHandler;
