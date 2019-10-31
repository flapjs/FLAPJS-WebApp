import AbstractAutoSaveHandler from '@flapjs/deprecated/autosave/AbstractAutoSaveHandler.js';

import Logger from '@flapjs/util/Logger.js';
const LOGGER_TAG = 'NodeGraphSaveHandler';

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
        const currentModuleID = this._session.moduleID;

        const data = dataStorage.getDataAsObject('graph-' + currentModuleID);
        if (data)
        {
            try
            {
                this._importManager.tryImportFileFromData(this._session, '', '.json', data);
            }
            catch(e)
            {
                // Ignore error
                Logger.error(LOGGER_TAG, 'Unable to auto load graph', e);
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
            Logger.error(LOGGER_TAG, 'Unable to auto save graph', e);
        }
    }

    /** @override */
    onAutoSaveUnload(dataStorage)
    {
        //Don't do anything...
    }
}

export default NodeGraphSaveHandler;
