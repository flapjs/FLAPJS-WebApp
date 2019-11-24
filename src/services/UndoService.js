import AbstractService from './AbstractService.js';

import UndoManager from '@flapjs/services/undo/UndoManager.js';

class UndoService extends AbstractService
{
    static get SERVICE_KEY() { return 'undoService'; }
    
    constructor()
    {
        super();

        this.undoManager = new UndoManager();
    }

    setEventHandlerFactory(eventHandlerFactory)
    {
        this.undoManager.setEventHandlerFactory(eventHandlerFactory);
        return this;
    }

    /** @override */
    onSessionLoad(session)
    {
        session.undoManager = this.undoManager;
    }

    /** @override */
    onSessionUnload(session)
    {
        this.undoManager.setEventHandlerFactory(null);
        this.undoManager.clear();

        delete session.undoManager;
    }
}
UndoService.INSTANCE = new UndoService();
UndoService.CONTEXT = null;

export default UndoService;
