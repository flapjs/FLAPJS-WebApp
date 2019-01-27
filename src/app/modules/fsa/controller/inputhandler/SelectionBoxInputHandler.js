import InputHandler from './InputHandler.js';

class SelectionBoxInputHandler extends InputHandler
{
  constructor(picker)
  {
    super();

    this._picker = picker;
  }

  //Override
  isTargetable(inputController, pointer, target, targetType)
  {
    return targetType === 'none';
  }

  //Override
  onDragStart(inputController, graphController, pointer, target)
  {
    if (!inputController.isMoveMode())
    {
      //Begin selection box...
      this._picker.beginSelection(graphController.getGraph(), pointer.x, pointer.y);
      return true;
    }

    return false;
  }

  onDragMove(inputController, graphController, pointer, target)
  {
    //If the selection box is active...
    if (this._picker.isSelecting())
    {
      //Update the selection box
      this._picker.updateSelection(graphController.getGraph(), pointer.x, pointer.y);
      return true;
    }

    return false;
  }

  //Override
  onDragStop(inputController, graphController, pointer, target)
  {
    //If was trying to select...
    if (this._picker.isSelecting())
    {
      //Stop selecting stuff, fool.
      this._picker.endSelection(graphController.getGraph(), pointer.x, pointer.y);
      return true;
    }

    return false;
  }
}

export default SelectionBoxInputHandler;
