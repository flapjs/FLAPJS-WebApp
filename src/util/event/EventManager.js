class EventManager
{
    constructor()
    {
        this.listeners = new Map();
    }

    emitEvent(event, ...values)
    {
        if (this.listeners.has(event))
        {
            for(const listener of this.listeners.get(event))
            {
                listener.apply(null, values);
            }
        }
        return this;
    }

    addEventListener(event, callback)
    {
        let result;
        if (!this.listeners.has(event))
        {
            this.listeners.set(event, result = []);
        }
        else
        {
            result = this.listeners.get(event);
        }
        result.push(callback);
        return this;
    }

    removeEventListener(event, callback)
    {
        if (this.listeners.has(event))
        {
            const listeners = this.listeners.get(event);
            listeners.splice(listeners.indexOf(callback), 1);
        }
        return this;
    }

    clearEventListeners()
    {
        this.listeners.clear();
        return this;
    }

    clearEventListenersByEvent(event)
    {
        this.listeners.delete(event);
        return this;
    }

    getEventListenersByEvent(event)
    {
        return this.listeners.get(event);
    }
}

export default EventManager;
