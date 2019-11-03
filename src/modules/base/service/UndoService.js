import AbstractService from './AbstractService.js';

import UndoManager from '@flapjs/deprecated/undo/UndoManager.js';

class UndoService extends AbstractService
{
    constructor()
    {
        super();

        this.undoManager = new UndoManager();
        this.eventHandlerFactory = null;
    }

    setEventHandlerFactory(eventHandlerFactory)
    {
        this.eventHandlerFactory = eventHandlerFactory;
        return this;
    }

    /** @override */
    load(session)
    {
        super.load(session);

        if (this.eventHandlerFactory) this.undoManager.setEventHandlerFactory(this.eventHandlerFactory);

        session.undoManager = this.undoManager;
        return this;
    }

    /** @override */
    unload(session)
    {
        super.unload(session);
        
        if (this.eventHandlerFactory) this.undoManager.setEventHandlerFactory(null);
        this.undoManager.clear();

        delete session.undoManager;
        return this;
    }
}

export default UndoService;
