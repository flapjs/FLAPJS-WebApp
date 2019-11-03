import AbstractAutoSaveHandler from '@flapjs/systems/autosave/AbstractAutoSaveHandler.js';

import Logger from '@flapjs/util/Logger.js';
const LOGGER_TAG = 'SessionSaver';

class SessionSaver extends AbstractAutoSaveHandler
{
    constructor(session)
    {
        super();

        this._session = session;
    }

    onSessionLoad(session, dataStorage) {}
    onSessionSave(session, dataStorage) {}

    /** @override */
    onAutoSaveLoad(dataStorage)
    {
        try
        {
            this.onSessionLoad(this._session, dataStorage);
        }
        catch(e)
        {
            // Ignore error
            Logger.error(LOGGER_TAG, 'Unable to autoload session', e);
        }
    }

    /** @override */
    onAutoSaveUpdate(dataStorage)
    {
        try
        {
            this.onSessionSave(this._session, dataStorage);
        }
        catch(e)
        {
            // Ignore error
            Logger.error(LOGGER_TAG, 'Unable to autosave session', e);
        }
    }

    /** @override */
    onAutoSaveUnload(dataStorage)
    {
        //Don't do anything...
    }
}

export default SessionSaver;
