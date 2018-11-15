class CreateNodeHandler
{
  constructor(controller)
  {
    this.controller = controller;
  }

  onDblActionEvent(pointer, picker)
  {
    const controller = this.controller;
    const inputController = controller.inputController;
    const x = pointer.x;
    const y = pointer.y;

    if (!inputController.isTrashMode())
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
