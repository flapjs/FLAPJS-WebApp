import EventManager from '@flapjs/util/event/EventManager';
import ModuleHandler from './ModuleHandler.js';

import Logger from '@flapjs/util/Logger.js';
const LOGGER_TAG = 'ModuleManager';

export const EVENT_ON_CHANGE_MODULE = 'changemodule';

class ModuleManager extends EventManager
{
    constructor(application)
    {
        super();

        this.application = application;
        this.currentModule = null;
        this.currentSession = {};

        this.moduleHandler = new ModuleHandler();
    }

    async changeModule(nextModule)
    {
        if (this.currentModule === nextModule)
        {
            Logger.out(LOGGER_TAG, '...ignoring redundant module change...');
            return;
        }

        if (this.currentModule)
        {
            Logger.out(LOGGER_TAG, `...destroying session with module '${this.currentModule.id}'...`);
            this.moduleHandler.destroySession(this.currentSession);
            this.currentSession = {};
        }

        this.currentModule = nextModule;

        if (this.currentModule)
        {
            Logger.out(LOGGER_TAG, `...preparing session for module '${this.currentModule.id}'...`);
            this.moduleHandler.prepareSessionForModule(this.currentSession, this.currentModule);
        }

        // Otherwise, it's already rendered correctly.
        this.emitEvent(EVENT_ON_CHANGE_MODULE, nextModule ? nextModule.id : null);
    }

    getCurrentModule()
    {
        return this.currentModule;
    }

    getCurrentSession()
    {
        return this.currentSession;
    }

    getCurrentReducer()
    {
        if (this.currentModule)
        {
            return this.currentModule.reducer || undefined;
        }
        else
        {
            return undefined;
        }
    }
}

export default ModuleManager;
