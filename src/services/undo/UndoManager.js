import Logger from '@flapjs/util/Logger.js';

const LOGGER_TAG = 'UndoManager';

const MAX_HISTORY_LENGTH = 1000;

class UndoManager
{
    constructor(eventHandlerFactory = null)
    {
        this.history = [];
        this.offsetIndex = 0;

        this._handlerFactory = eventHandlerFactory;
    }

    setEventHandlerFactory(factory)
    {
        this._handlerFactory = factory;
        return this;
    }

    captureEvent(...args)
    {
        if (typeof this._handlerFactory === 'function')
        {
            const handler = this._handlerFactory(args);
            if (handler)
            {
                this.captureEventAsHandler(handler);
            }
            else
            {
                throw new Error('Cannot create valid undo event handler for capture');
            }
        }
        else
        {
            Logger.error(LOGGER_TAG, 'Missing default undo event handler for event capture');
        }
    }

    captureEventAsHandler(eventHandler)
    {
        //Pop it all until current event
        while (this.offsetIndex > 0)
        {
            this.history.pop();
            --this.offsetIndex;
        }

        //Push the current event to the stack
        this.history.push(eventHandler);

        while (this.history.length > MAX_HISTORY_LENGTH)
        {
            this.history.unshift();
        }
    }

    getPreviousEvent()
    {
        if (!this.canUndo()) return null;
        return this.history[this.history.length - this.offsetIndex - 1];
    }

    getNextEvent()
    {
        if (!this.canRedo()) return null;
        return this.history[this.history.length - this.offsetIndex + 1];
    }

    undo()
    {
        if (!this.canUndo())
        {
            //Already the oldest recorded event!
            return;
        }

        const event = this.history[this.history.length - this.offsetIndex - 1];
        ++this.offsetIndex;

        event.applyUndo(this);
    }

    canUndo()
    {
        return this.offsetIndex < this.history.length;
    }

    redo()
    {
        if (!this.canRedo())
        {
            //Already the most recent event!
            return;
        }

        --this.offsetIndex;
        const event = this.history[this.history.length - this.offsetIndex - 1];

        event.applyRedo(this);
    }

    canRedo()
    {
        return this.offsetIndex > 0;
    }

    clear()
    {
        this.history.length = 0;
        this.offsetIndex = 0;
    }

    getEventHandlerFactory() { return this._handlerFactory; }
}

export default UndoManager;
