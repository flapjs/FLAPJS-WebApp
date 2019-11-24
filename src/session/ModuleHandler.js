import { uuid } from '@flapjs/util/MathHelper';

class ModuleHandler
{
    constructor() {}

    prepareSessionForModule(session, currentModule)
    {
        if (!currentModule) return;
        
        session.sessionID = uuid();
        session.sessionName = 'Untitled';
        session.moduleID = currentModule.id;
        session.module = currentModule;

        if (typeof currentModule.preload === 'function')
        {
            currentModule.preload(session);
        }
    }

    loadSessionForModule(session, currentModule)
    {
        if (typeof currentModule.load === 'function')
        {
            currentModule.load(session);
        }
    }

    didMountSession(sessionProvider)
    {
    }

    willUnmountSession(sessionProvider)
    {
    }

    destroySession(session)
    {
    }
}

export default ModuleHandler;
