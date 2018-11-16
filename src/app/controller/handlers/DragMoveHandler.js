
class DragMoveHandler
{
  constructor(inputController, graphController)
  {
    this.inputController = inputController;
    this.graphController = graphController;
  }

  onEvent(pointer)
  {
    const inputController = this.inputController;
    const graphController = this.graphController;
    const picker = inputController.getPicker();
    const x = pointer.x;
    const y = pointer.y;
    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    //If is in move mode...
    if (inputController.isMoveMode())
    {
      //Continue to move node(s)
      if (targetType === 'node')
      {
        if (picker.hasSelection())
        {
          graphController.moveMultipleNodesTo(pointer, picker.getSelection(), x, y);
        }
        else
        {
          graphController.moveNodeTo(pointer, target, x, y);
        }
        return true;
      }
      //Continue to move edge vertex
      else if (targetType === 'edge')
      {
        graphController.moveEdgeTo(pointer, target, x, y);
        return true;
      }
      //Continue to move edge endpoint
      else if (targetType === 'endpoint')
      {
        graphController.moveEndpointTo(pointer, target, x, y);
        return true;
      }
      //Continue to move initial
      else if (targetType === 'initial')
      {
        //Move initial marker to node or pointer
        const dst = picker.getNodeAt(x, y) || pointer;
        inputController.ghostInitialMarker = dst;
        return true;
      }
      //Continue to move graph
      else if (targetType === 'none')
      {
        //Move graph
        const dx = x - graphController.prevX;
        const dy = y - graphController.prevY;
        this.inputController.getViewport().addOffset(dx, dy, true);
        return true;
      }
      else
      {
        //All move drag should be handled
        throw new Error("Unknown target type \'" + targetType + "\'.");
      }
    }
    //If is NOT in move mode...
    else
    {
      if (inputController.isNewEdge)
      {
        graphController.moveEndpointTo(pointer, target, x, y);
        return true;
      }

      //If the selection box is active...
      if (picker.isSelecting())
      {
        //Update the selection box
        picker.updateSelection(x, y);
        return true;
      }

      //Otherwise, don't do anything. Cause even action drags will become move drags.
    }

    return false;
  }
}

export default DragMoveHandler;
