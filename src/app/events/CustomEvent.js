import Event from './Event.js';

class CustomEvent extends Event
{
  constructor(undoHandler, redoHandler)
  {
    super();
    this.undoHandler = undoHandler;
    this.redoHandler = redoHandler;
  }

  //Override
  applyUndo()
  {
    this.undoHandler();
  }

  //Override
  applyRedo()
  {
    this.redoHandler();
  }
}

export default CustomEvent;
