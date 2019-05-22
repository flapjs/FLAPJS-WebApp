class AbstractEventHandler
{
    constructor() {}

    applyUndo(undoManager)
    {
        throw new Error('Undo operation for handler not supported');
    }

    applyRedo(undoManager)
    {
        throw new Error('Redo operation for handler not supported');
    }
}

export default AbstractEventHandler;
