
class GrammarChangeHandler
{
    constructor(refreshTicks=10)
    {
        this._cachedGrammarHash = 0;

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
        this._cachedGrammarHash = 0;
    }

    update(grammar)
    {
        if (++this._elapsedTicks >= this._refreshTicks)
        {
            this._elapsedTicks = 0;

            //!!!!!!!!!! CHANGED THIS RELATIVE TO RE VERSION!!!!!!!!!!!!!!!!!
            const gramHash = grammar.getHashCode();
            if (gramHash !== this._cachedGrammarHash)
            {
                this._cachedGrammarHash = gramHash;
                for(const listener of this._listeners)
                {
                    listener(grammar);
                }
            }
        }
    }
}

export default GrammarChangeHandler;
