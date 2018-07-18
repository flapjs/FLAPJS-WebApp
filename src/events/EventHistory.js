const MAX_HISTORY_LENGTH = 100;

class EventHistory
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

  undo()
  {
    if (this.offsetIndex >= this.history.length)
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
    if (this.offsetIndex <= 0)
    {
      //Already the most recent event!
      return;
    }

    --this.offsetIndex;
    const event = this.history[this.history.length - this.offsetIndex - 1];

    event.applyRedo();
  }
}

export default EventHistory;
