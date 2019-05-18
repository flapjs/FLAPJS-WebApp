import AbstractInputHandler from 'util/input/AbstractInputHandler.js';

class ViewportInputHandler extends AbstractInputHandler
{
    constructor(inputController)
    {
        super();

        this._inputController = inputController;

        this._cachedPosition = {x: 0, y: 0};
    }

    /** @override */
    onDragStart(pointer)
    {
        const inputController = this._inputController;
        if (inputController.hasActiveTarget()) return false;
        if (inputController.hasCurrentTarget()) return false;
        if (!inputController.isMoveMode(pointer.getInputAdapter())) return false;

        const inputEventPosition = pointer.getInputEventPosition();
        this._cachedPosition.x = inputEventPosition.x;
        this._cachedPosition.y = inputEventPosition.y;
        return true;
    }
  
    /** @override */
    onDragMove(pointer)
    {
        const dx = pointer.x - this._cachedPosition.x;
        const dy = pointer.y - this._cachedPosition.y;

        const viewport = pointer.getViewportAdapter();
        viewport.addOffset(dx, dy, true);

        /*
		// We don't want to update it due to how viewports are positioned.
		this._cachedPosition.x = pointer.x;
		this._cachedPosition.y = pointer.y;
		*/
    }
  
    /** @override */
    onDragStop(pointer)
    {
        // Do nothing.
    }
}

export default ViewportInputHandler;