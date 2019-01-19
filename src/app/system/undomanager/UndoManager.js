const MAX_HISTORY_LENGTH = 1000;

class UndoManager
{
  constructor()
  {
    this.history = [];
    this.offsetIndex = 0;
  }

  clear()
  {
    this.history.length = 0;
    this.offsetIndex = 0;
  }

  captureEvent(eventHandler)
  {
    //Pop it all until current event
    while(this.offsetIndex > 0)
    {
      this.history.pop();
      --this.offsetIndex;
    }

    //Push the current event to the stack
    this.history.push(eventHandler);

    while(this.history.length > MAX_HISTORY_LENGTH)
    {
      this.history.unshift();
    }
  }

  getPreviousEvent()
  {
    if (!this.canUndo()) return null;
    return this.history[this.history.length - this.offsetIndex - 1];
  }

  getNextEvent()
  {
    if (!this.canRedo()) return null;
    return this.history[this.history.length - this.offsetIndex + 1];
  }

  undo()
  {
    if (!this.canUndo())
    {
      //Already the oldest recorded event!
      return;
    }

    const event = this.history[this.history.length - this.offsetIndex - 1];
    ++this.offsetIndex;

    event.applyUndo(undoManager);
  }

  canUndo()
  {
    return this.offsetIndex < this.history.length;
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

    event.applyRedo(undoManager);
  }

  canRedo()
  {
    return this.offsetIndex > 0;
  }
}

export default UndoManager;
