import AbstractService from './AbstractService.js';
import AutoSaveManager from '@flapjs/systems/autosave/AutoSaveManager.js';
import LocalStorage from '@flapjs/util/storage/LocalStorage.js';

class AutoSaveService extends AbstractService
{
    static get SERVICE_KEY() { return 'autoSaveService'; }

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

        delete session.autoSaveManager;
        return this;
    }
}
AutoSaveService.INSTANCE = new AutoSaveService();
AutoSaveService.CONTEXT = null;

export default AutoSaveService;
