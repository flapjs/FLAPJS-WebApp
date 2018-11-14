class TrashModeHandler
{
  constructor(controller)
  {
    this.controller = controller;

    this.prevX = 0;
    this.prevY = 0;
  }

  onActionEvent(pointer)
  {
    const controller = this.controller;
    const x = pointer.x;
    const y = pointer.y;
    const target = pointer.getPicker().initialTarget;
    const targetType = pointer.getPicker().initialTargetType;

    if (!pointer.isTrashMode(x, y)) return false;

    //Click to delete node
    if (targetType === 'node')
    {
      //So that the emitted 'delete' events can use this
      this.prevX = target.x;
      this.prevY = target.y;

      //If there exists selected states, delete them all!
      if (pointer.getPicker().hasSelection())
      {
        //Delete all selected nodes
        controller.deleteSelectedNodes(target);
      }
      else
      {
        //Delete a single node
        controller.deleteTargetNode(target);
      }

      return true;
    }
    else if (targetType === 'edge' || targetType === 'endpoint')
    {
      //Delete a single edge
      controller.deleteTargetEdge(target);
      return true;
    }
    else
    {
      //Clicked on something you cannot delete
      return true;
    }
  }
}

export default TrashModeHandler;
