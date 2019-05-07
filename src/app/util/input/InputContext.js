class InputContext
{
    constructor()
    {
        this._inputHandlers = [];
    }

    addInputHandler(inputHandler)
    {
        this._inputHandlers.push(inputHandler);
        return this;
    }

    removeInputHandler(inputHandler)
    {
        const index = this._inputHandlers.indexOf(inputHandler);
        if (index >= 0) this._inputHandlers.splice(index, 1);
        return this;
    }

    clearInputHandlers() { this._inputHandlers.length = 0; }

    handleEvent(eventName, ...eventArgs)
    {
        //Let others handle this event...
        for (const inputHandler of this._inputHandlers)
        {
            const handlerEventCallback = inputHandler[eventName];
            if (typeof handlerEventCallback === 'function')
            {
                if (handlerEventCallback.apply(inputHandler, eventArgs))
                {
                    return inputHandler;
                }
            }
        }

        return null;
    }

    getInputHandlers() { return this._inputHandlers; }
    hasInputHandlers() { return this._inputHandlers.length > 0; }
}

export default InputContext;