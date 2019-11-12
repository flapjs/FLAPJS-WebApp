import AbstractService from './AbstractService.js';

import UndoManager from '@flapjs/systems/undo/UndoManager.js';

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
    load(session)
    {
        super.load(session);

        session.undoManager = this.undoManager;
        return this;
    }

    /** @override */
    unload(session)
    {
        super.unload(session);
        
        this.undoManager.setEventHandlerFactory(null);
        this.undoManager.clear();

        delete session.undoManager;
        return this;
    }
}

export default UndoService;
