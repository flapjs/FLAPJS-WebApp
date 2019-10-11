import Logger from '@flapjs/util/Logger.js';

const LOGGER_TAG = 'ModuleManager';

class ModuleManager
{
    constructor(application, defaultModule = null)
    {
        this.application = application;
        this.defaultModule = defaultModule;
        this.currentModule = defaultModule;

        // The context is bound so it can be passed around as a callback...
        this.changeModule = this.changeModule.bind(this);
    }

    async changeModule(nextModuleID, forceRender = true)
    {
        let nextModule;
        if (nextModuleID)
        {
            try
            {
                nextModule = await this.application.loadModuleByID(nextModuleID);
                if (!nextModule) throw new Error('Cannot load null module.');
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
            this.currentModule = this.defaultModule;
        }

        if (forceRender)
        {
            // Render to terminated application state...
            this.application.render(true);
        }
        
        if (nextModule)
        {
            this.currentModule = nextModule;

            if (forceRender)
            {
                // Render to next application state...
                this.application.render();
            }
        }
        // Otherwise, it's already rendered correctly.
    }

    getCurrentModule()
    {
        return this.currentModule;
    }
}

export default ModuleManager;
