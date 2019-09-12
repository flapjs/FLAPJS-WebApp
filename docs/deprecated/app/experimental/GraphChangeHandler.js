class GraphChangeHandler
{
    constructor(refreshTicks=10)
    {
        this._cachedGraphHash = 0;

        this._refreshTicks = refreshTicks;
        this._elapsedTicks = Infinity;

        this._listeners = [];
    }

    addListener(listener)
    {
        if (typeof listener !== 'function')
            throw new Error('Cannot add uncallable listener');
        this._listeners.push(listener);
    }

    removeListener(listener)
    {
        const i = this._listeners.indexOf(listener);
        if (i >= 0)
        {
            this._listeners.splice(i, 1);
            return true;
        }
        return false;
    }

    clearListeners()
    {
        this._listeners.length = 0;
    }

    getListeners()
    {
        return this._listeners;
    }

    reset()
    {
        this._elapsedTicks = 0;
        this._cachedGraphHash = 0;
    }

    update(graph)
    {
        if (++this._elapsedTicks >= this._refreshTicks)
        {
            this._elapsedTicks = 0;

            const graphHash = graph.getHashCode(false);
            if (graphHash !== this._cachedGraphHash)
            {
                this._cachedGraphHash = graphHash;
                for(const listener of this._listeners)
                {
                    listener(graph);
                }
            }
        }
    }
}

export default GraphChangeHandler;
