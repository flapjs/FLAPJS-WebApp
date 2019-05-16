class InputContext
{
    constructor()
    {
        this._inputHandlers = [];
    }

    addInputHandler(inputHandler, priority = -1)
    {
        if (priority < 0)
        {
            this._inputHandlers.push(inputHandler);
        }
        else
        {
            let flag = false;
            while(this._inputHandlers.length <= priority || (flag = this._inputHandlers[priority]))
            {
                if (flag)
                {
                    ++priority;
                    flag = false;
                }
                else
                {
                    this._inputHandlers.push(null);
                }
            }
            this._inputHandlers[priority] = inputHandler;
        }

        return this;
    }

    removeInputHandler(inputHandler)
    {
        const index = this._inputHandlers.indexOf(inputHandler);
        if (index >= 0)
        {
            this._inputHandlers[index] = null;
        }
        return this;
    }

    clearInputHandlers() { this._inputHandlers.length = 0; }

    handleEvent(eventName, ...eventArgs)
    {
        //Let others handle this event...
        for (const inputHandler of this._inputHandlers)
        {
            if (!inputHandler) continue;
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
}

export default InputContext;