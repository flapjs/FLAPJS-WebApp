const DEFAULT_REFRESH_TICKS = 10;

class ControllerChangeHandler
{
    constructor(target, hashFunction = target => JSON.stringify(target), refreshTicks = DEFAULT_REFRESH_TICKS)
    {
        this._target = target;
        this._hashFunction = hashFunction;
        this._cachedHash = 0;

        this._refreshTicks = refreshTicks;

        this._listeners = [];

        this._updateInterval = null;
        this.update = this.update.bind(this);
    }

    addChangeListener(listener)
    {
        if (typeof listener !== 'function')
            throw new Error('Cannot add uncallable listener');
        this._listeners.push(listener);
    }

    removeChangeListener(listener)
    {
        const i = this._listeners.indexOf(listener);
        if (i >= 0)
        {
            this._listeners.splice(i, 1);
            return true;
        }
        return false;
    }

    clearChangeListeners() { this._listeners.length = 0; }
    getChangeListeners() { return this._listeners; }

    startListeningForChanges()
    {
        this._updateInterval = setInterval(this.update, this._refreshTicks);
        this.update();
    }

    stopListeningForChanges()
    {
        clearInterval(this._updateInterval);
    }

    reset()
    {
        this._cachedGraphHash = 0;
        this.update();
    }

    update(forceUpdate = false)
    {
        const target = this._target;
        const targetHash = this._hashFunction(target);
        if (forceUpdate || targetHash !== this._cachedHash)
        {
            this._cachedHash = targetHash;
            for (const listener of this._listeners)
            {
                listener(target, targetHash);
            }
        }
    }
}

export default ControllerChangeHandler;
