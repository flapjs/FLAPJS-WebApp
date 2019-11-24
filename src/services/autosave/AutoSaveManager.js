const DEFAULT_AUTOSAVE_INTERVAL = 1000;

/**
 * Handles the autosave lifecycle. To use this, you must register
 * an instance of AbstractAutoSaveHandler.
 */
class AutoSaveManager
{
    constructor(dataStorage, interval = DEFAULT_AUTOSAVE_INTERVAL)
    {
        this._init = false;
        this._handlers = [];
        this._storage = dataStorage;

        this._intervalTime = interval;
        this._interval = null;

        this.onIntervalUpdate = this.onIntervalUpdate.bind(this);
    }

    registerHandler(handler)
    {
        this._handlers.push(handler);
        if (this._init)
        {
            handler.onAutoSaveLoad(this._storage);
        }
        return this;
    }

    unregisterHandler(handler)
    {
        this._handlers.splice(this._handlers.indexOf(handler), 1);
        if (this._init)
        {
            handler.onAutoSaveUnload(this._storage);
        }
        return this;
    }

    clearHandlers()
    {
        this._handlers.length = 0;
    }

    initialize()
    {
        if (!this._storage.isSupported()) return;

        this._init = true;
        this.load();
        this._interval = setInterval(this.onIntervalUpdate, this._intervalTime);
    }

    terminate()
    {
        if (!this._init) return;

        clearInterval(this._interval);
        this._interval = null;

        this.unload();
        this._init = false;
        this.clearHandlers();
    }

    onIntervalUpdate()
    {
        for(const handler of this._handlers)
        {
            handler.onAutoSaveUpdate(this._storage);
        }
    }

    load()
    {
        if (!this._init) throw new Error('Cannot load when not yet initialized');

        for(const handler of this._handlers)
        {
            handler.onAutoSaveLoad(this._storage);
        }
    }

    unload()
    {
        if (!this._init) throw new Error('Cannot save when not yet initialized');

        for(const handler of this._handlers)
        {
            handler.onAutoSaveUnload(this._storage);
        }
    }
}

export default AutoSaveManager;
