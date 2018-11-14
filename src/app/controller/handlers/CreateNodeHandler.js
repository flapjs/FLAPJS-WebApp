class CreateNodeHandler
{
  constructor(controller)
  {
    this.controller = controller;
  }

  onDblActionEvent(pointer)
  {
    const controller = this.controller;
    const x = pointer.x;
    const y = pointer.y;

    if (!pointer.isTrashMode(x, y))
    {
      //Create state at position
      controller.createNode(x, y);
      return true;
    }
    else
    {
      controller.emit("tryCreateWhileTrash");
      return true;
    }
    
    return false;
  }
}

export default CreateNodeHandler;
