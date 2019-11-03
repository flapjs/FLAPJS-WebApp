import AbstractService from './AbstractService.js';
import AutoSaveManager from '@flapjs/systems/autosave/AutoSaveManager';
import LocalStorage from '@flapjs/util/storage/LocalStorage';

class AutoSaveService extends AbstractService
{
    constructor()
    {
        super();
        this.autoSaveManager = new AutoSaveManager(LocalStorage);
        this.autoSaveHandler = null;
    }

    setAutoSaveHandler(autoSaveHandler)
    {
        this.autoSaveHandler = autoSaveHandler;
        return this;
    }

    /** @override */
    load(session)
    {
        super.load(session);

        if (this.autoSaveHandler) this.autoSaveManager.registerHandler(this.autoSaveHandler);
        this.autoSaveManager.initialize();

        session.autoSaveManager = this.autoSaveManager;
        return this;
    }

    /** @override */
    unload(session)
    {
        super.unload(session);
        
        if (this.autoSaveHandler) this.autoSaveManager.unregisterHandler(this.autoSaveHandler);
        this.autoSaveManager.terminate();

        delete session.autoSaveManager;
        return this;
    }
}

export default AutoSaveService;
