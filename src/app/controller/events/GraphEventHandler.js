class GraphEventHandler
{
  constructor(eventLogger, graphController, eventName, postEventName)
  {
    this.eventLogger = eventLogger;
    this.graphController = graphController;
    this.eventName = eventName;
    this.postEventName = postEventName;

    this.onEvent = this.onEvent.bind(this);

    this.graphController.on(this.eventName, this.onEvent);
  }

  destroy()
  {
    this.graphController.removeEventListener(this.eventName, this.onEvent);
  }

  onEvent(...args)
  {
    const result = {};
    result.applyUndo = this.applyUndo.bind(this, result);
    result.applyRedo = this.applyRedo.bind(this, result);
    result.eventData = this.captureEvent(...args);

    if (this.postEventName !== null)
    {
      //Wait for post event to finalize event
      this.graphController.once(this.postEventName, (...args) => {
        result.postData = this.capturePostEvent(...args);

        this.eventLogger.handleEvent(result);
      });
    }
    else
    {
      //Finalize event right now
      this.eventLogger.handleEvent(result);
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

export default GraphEventHandler;
