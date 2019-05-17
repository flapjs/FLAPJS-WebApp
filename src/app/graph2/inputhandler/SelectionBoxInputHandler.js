import AbstractInputHandler from 'util/input/AbstractInputHandler.js';

class SelectionBoxInputHandler extends AbstractInputHandler
{
    constructor(inputController, graphController, selectionBox)
    {
        super();

        this._inputController = inputController;
        this._graphController = graphController;
        this._selectionBox = selectionBox;
    }

    /** @override */
    onPreInputEvent(pointer)
    {
        const inputController = this._inputController;
        const selectionBox = this._selectionBox;
        if (selectionBox.hasSelection())
        {
            if (!inputController.isMoveMode(pointer.getInputAdapter()) || !selectionBox.isTargetInSelection(inputController.getImmediateTargetSource()))
            {
                selectionBox.clearSelection();
            }
        }

        return false;
    }

    /** @override */
    onDragStart(pointer)
    {
        const inputController = this._inputController;
        if (inputController.hasActiveTarget()) return false;
        if (inputController.isMoveMode(pointer.getInputAdapter())) return false;
        if (inputController.hasCurrentTarget()) return false;

        const inputEventPosition = pointer.getInputEventPosition();
        this._selectionBox.beginSelection(this._graphController.getGraph(), inputEventPosition.x, inputEventPosition.y);
        return true;
    }
  
    /** @override */
    onDragMove(pointer)
    {
        if (this._selectionBox.isVisible())
        {
            this._selectionBox.updateSelection(this._graphController.getGraph(), pointer.x, pointer.y);
        }
    }
  
    /** @override */
    onDragStop(pointer)
    {
        if (this._selectionBox.isVisible())
        {
            this._selectionBox.endSelection(this._graphController.getGraph(), pointer.x, pointer.y);
        }
    }
}

export default SelectionBoxInputHandler;