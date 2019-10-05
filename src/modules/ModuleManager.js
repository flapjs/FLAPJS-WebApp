import Logger from '@flapjs/util/Logger.js';
import ModuleSession from '@flapjs/modules/ModuleSession';

const LOGGER_TAG = 'ModuleManager';

class ModuleManager
{
    constructor(application, defaultModule = null)
    {
        this.application = application;
        this.defaultModule = defaultModule;

        this.currentModule = null;
        this.currentSession = new ModuleSession();

        if (this.defaultModule)
        {
            this.currentModule = this.defaultModule;
            initializeModule(this.currentModule, this.currentSession);
        }
    }

    async changeModule(nextModuleID, forceRender = true)
    {
        let nextModule;
        if (nextModuleID)
        {
            try
            {
                nextModule = await this.application.loadModuleByID(nextModuleID);
            }
            catch(e)
            {
                Logger.error(LOGGER_TAG, 'Failed to load module.', e);
                return;
            }
        }
        else
        {
            nextModule = this.defaultModule;
        }

        if (this.currentModule)
        {
            terminateModule(this.currentModule, this.currentSession);
            this.currentModule = null;
        }

        if (forceRender)
        {
            // Render to terminated application state...
            this.application.render();
        }
        
        if (nextModule)
        {
            const nextSession = new ModuleSession();
            if (initializeModule(nextModule, nextSession))
            {
                this.currentModule = nextModule;
                this.currentSession = nextSession;

                if (forceRender)
                {
                    // Render to next application state...
                    this.application.render();
                }
            }
        }
        // Otherwise, it's already rendered correctly.
    }

    getCurrentModule()
    {
        return this.currentModule;
    }

    getCurrentSession()
    {
        return this.currentSession;
    }
}

function initializeModule(targetModule, session)
{
    try
    {
        targetModule.onInitialization(session);
        return true;
    }
    catch(e)
    {
        Logger.error(LOGGER_TAG, 'Module failed to initialize.', e);
        return false;
    }
}

function terminateModule(targetModule, session)
{
    try
    {
        targetModule.onTermination(session);
        return true;
    }
    catch(e)
    {
        Logger.error(LOGGER_TAG, 'Module failed to terminate.', e);
        return false;
    }
}

export default ModuleManager;
