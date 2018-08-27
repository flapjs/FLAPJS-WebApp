const MAX_HISTORY_LENGTH = 100;

class EventLogger
{
  constructor()
  {
    this.history = [];
    this.offsetIndex = 0;
  }

  handleEvent(event)
  {
    //Pop it all until current event
    while(this.offsetIndex > 0)
    {
      this.history.pop();
      --this.offsetIndex;
    }

    //Push the current event to the stack
    this.history.push(event);

    while(this.history.length > MAX_HISTORY_LENGTH)
    {
      this.history.unshift();
    }
  }

  clear()
  {
    this.history.length = 0;
    this.offsetIndex = 0;
  }

  undo()
  {
    if (!this.canUndo())
    {
      //Already the oldeset recorded event!
      return;
    }

    const event = this.history[this.history.length - this.offsetIndex - 1];
    ++this.offsetIndex;

    event.applyUndo();
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

    event.applyRedo();
  }

  canUndo()
  {
    return this.offsetIndex < this.history.length;
  }

  canRedo()
  {
    return this.offsetIndex > 0;
  }
}

export default EventLogger;
