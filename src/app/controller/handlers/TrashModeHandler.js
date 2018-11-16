class TrashModeHandler
{
  constructor(graphController)
  {
    this.controller = graphController;

    this.prevX = 0;
    this.prevY = 0;
  }

  onActionEvent(pointer, picker)
  {
    const graphController = this.controller;
    const inputController = graphController.inputController;
    const x = pointer.x;
    const y = pointer.y;
    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    if (!inputController.isTrashMode()) return false;

    //Click to delete node
    if (targetType === 'node')
    {
      //So that the emitted 'delete' events can use this
      this.prevX = target.x;
      this.prevY = target.y;

      //If there exists selected states, delete them all!
      if (picker.hasSelection())
      {
        //Delete all selected nodes
        graphController.deleteSelectedNodes(target);
      }
      else
      {
        //Delete a single node
        graphController.deleteTargetNode(target);
      }

      return true;
    }
    else if (targetType === 'edge' || targetType === 'endpoint')
    {
      //Delete a single edge
      graphController.deleteTargetEdge(target);
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
