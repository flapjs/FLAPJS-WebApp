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
    onSessionLoad(session)
    {
        this.autoSaveManager.initialize();

        session.autoSaveManager = this.autoSaveManager;
    }

    /** @override */
    onSessionUnload(session)
    {
        this.autoSaveManager.terminate();

        delete session.autoSaveManager;
    }
}
AutoSaveService.INSTANCE = new AutoSaveService();
AutoSaveService.CONTEXT = null;

export default AutoSaveService;
