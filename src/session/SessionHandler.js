import { uuid } from '@flapjs/util/MathHelper.js';
import Logger from '@flapjs/util/Logger.js';

const LOGGER_TAG = 'SessionHandler';

/**
 * This is used by App.jsx to handle all Module session provider logic. Most of its
 * functions are used as callbacks for <SessionProvider/>.
 */
class SessionHandler
{
    constructor() {}

    prepareSessionForModule(session, currentModule)
    {
        if (!currentModule) return;
        
        session.sessionID = uuid();
        session.sessionName = 'Untitled';
        session.moduleID = currentModule.id;
        session.module = currentModule;

        // Handle listeners...
        try
        {
            if (typeof currentModule.preload === 'function')
            {
                currentModule.preload(session);
            }
        }
        catch(e)
        {
            Logger.error(LOGGER_TAG, 'Module failed preload() for session', e);
        }
    }

    loadSessionForModule(session, currentModule)
    {
        // Handle listeners...
        try
        {
            if (typeof currentModule.load === 'function')
            {
                currentModule.load(session);
            }
        }
        catch(e)
        {
            Logger.error(LOGGER_TAG, 'Module failed load() for session', e);
        }
    }

    didMountSession(sessionProvider, currentModule)
    {
        if (!currentModule) return;

        // Handle listeners...
        try
        {
            if (typeof currentModule.onSessionMount === 'function')
            {
                currentModule.onSessionMount(sessionProvider);
            }
        }
        catch(e)
        {
            Logger.error(LOGGER_TAG, 'Module failed onSessionMount() for session', e);
        }
    }

    willUnmountSession(sessionProvider, currentModule)
    {
        if (!currentModule) return;

        // Handle listeners...
        try
        {
            if (typeof currentModule.onSessionUnmount === 'function')
            {
                currentModule.onSessionUnmount(sessionProvider);
            }
        }
        catch(e)
        {
            Logger.error(LOGGER_TAG, 'Module failed onSessionUnmount() for session', e);
        }
    }

    destroySession(session, currentModule)
    {
        if (!currentModule) return;

        // Handle listeners...
        try
        {
            if (typeof currentModule.unload === 'function')
            {
                currentModule.unload(session);
            }
        }
        catch(e)
        {
            Logger.error(LOGGER_TAG, 'Module failed unload() for session', e);
        }
    }
}

export default SessionHandler;
