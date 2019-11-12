import AbstractService from './AbstractService.js';
import AutoSaveManager from '@flapjs/systems/autosave/AutoSaveManager';
import LocalStorage from '@flapjs/util/storage/LocalStorage';

class AutoSaveService extends AbstractService
{
    constructor()
    {
        super();
        this.autoSaveManager = new AutoSaveManager(LocalStorage);
    }

    registerAutoSaveHandler(autoSaveHandler)
    {
        this.autoSaveManager.registerHandler(autoSaveHandler);
        return this;
    }

    /** @override */
    load(session)
    {
        super.load(session);

        this.autoSaveManager.initialize();

        session.autoSaveManager = this.autoSaveManager;
        return this;
    }

    /** @override */
    unload(session)
    {
        super.unload(session);

        this.autoSaveManager.terminate();
        this.autoSaveManager.clearHandlers();

        delete session.autoSaveManager;
        return this;
    }
}

export default AutoSaveService;
