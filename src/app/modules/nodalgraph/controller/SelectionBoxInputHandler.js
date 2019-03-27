import AbstractInputHandler from 'input/AbstractInputHandler.js';

class SelectionBoxInputHandler extends AbstractInputHandler
{
  constructor(inputController, graphController, selectionBox)
  {
    super();

    this._inputController = inputController;
    this._graphController = graphController;
    this._selectionBox = selectionBox;
  }

  //Override
  onDragStart(pointer)
  {
    if (!this._inputController.isMoveMode())
    {
      //Begin selection box...
      this._selectionBox.beginSelection(this._graphController.getGraph(), pointer.x, pointer.y);
      return true;
    }

    return false;
  }

  //Override
  onDragMove(pointer)
  {
    //If the selection box is active...
    if (this._selectionBox.isSelecting())
    {
      //Update the selection box
      this._selectionBox.updateSelection(this._graphController.getGraph(), pointer.x, pointer.y);
      return true;
    }

    return false;
  }

  //Override
  onDragStop(pointer)
  {
    //If was trying to select...
    if (this._selectionBox.isSelecting())
    {
      //Stop selecting stuff, fool.
      this._selectionBox.endSelection(this._graphController.getGraph(), pointer.x, pointer.y);
      return true;
    }

    return false;
  }
}

export default SelectionBoxInputHandler;
