import EventManager from '@flapjs/util/event/EventManager';
import SessionHandler from './SessionHandler.js';
import ServiceHandler from './ServiceHandler.js';

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

        this.sessionHandler = new SessionHandler();
        this.serviceHandler = new ServiceHandler();

        this.onDidMount = this.onDidMount.bind(this);
        this.onWillUnmount = this.onWillUnmount.bind(this);
    }

    onDidMount(app)
    {
        const sessionProvider = app.sessionProvider.current;
        this.sessionHandler.didMountSession(sessionProvider, this.currentModule);
        this.serviceHandler.didMountSession(sessionProvider, this.currentModule);
    }

    onWillUnmount(app)
    {
        const sessionProvider = app.sessionProvider.current;
        this.serviceHandler.willUnmountSession(sessionProvider, this.currentModule);
        this.sessionHandler.willUnmountSession(sessionProvider, this.currentModule);
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
            this.serviceHandler.destroySession(this.currentSession, this.currentModule);
            this.sessionHandler.destroySession(this.currentSession, this.currentModule);
            this.currentSession = {};
        }

        this.currentModule = nextModule;

        if (this.currentModule)
        {
            Logger.out(LOGGER_TAG, `...preparing session for module '${this.currentModule.id}'...`);
            this.sessionHandler.prepareSessionForModule(this.currentSession, this.currentModule);
            this.serviceHandler.prepareServicesForModule(this.currentSession, this.currentModule);
            Logger.out(LOGGER_TAG, `...loading session for module '${this.currentModule.id}'...`);
            this.sessionHandler.loadSessionForModule(this.currentSession, this.currentModule);
            this.serviceHandler.loadServicesForModule(this.currentSession, this.currentModule);
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
