class AbstractEventHandler
{
  constructor() {}

  applyUndo()
  {
    throw new Error("Undo operation for handler not supported");
  }

  applyRedo()
  {
    throw new Error("Redo operation for handler not supported");
  }
}

export default AbstractEventHandler;
