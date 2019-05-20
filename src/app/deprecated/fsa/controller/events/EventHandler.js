class EventHandler
{
    constructor(eventLogger, controller, eventName, postEventName)
    {
        this.eventLogger = eventLogger;
        this.controller = controller;
        this.eventName = eventName;
        this.postEventName = postEventName || null;

        this.onEvent = this.onEvent.bind(this);

        this.controller.on(this.eventName, this.onEvent);
    }

    destroy()
    {
        this.controller.removeEventListener(this.eventName, this.onEvent);
    }

    onEvent(...args)
    {
        const result = {};
        result.applyUndo = this.applyUndo.bind(this, result);
        result.applyRedo = this.applyRedo.bind(this, result);

        result.eventData = this.captureEvent(...args);

        if (this.postEventName)
        {
            //Wait for post event to finalize event
            this.controller.once(this.postEventName, (...args) => 
            {
                result.postData = this.capturePostEvent(...args);

                this.eventLogger.captureEvent(result);
            });
        }
        else
        {
            result.postData = result.eventData;

            //Finalize event right now
            this.eventLogger.captureEvent(result);
        }
    }

    captureEvent(...args)
    {
        return {};
    }

    capturePostEvent(...args)
    {
        return {};
    }

    applyUndo(e)
    {

    }

    applyRedo(e)
    {

    }
}

export default EventHandler;
