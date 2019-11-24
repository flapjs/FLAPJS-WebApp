/**
 * Used by InputAdapter to handle input event logic.
 */
class AbstractInputHandler
{
    constructor() {}

    /**
     * Called by InputAdapter before an InputEvent begins.
Returns true if the event should be consumed. If consumed, the event will
not begin.
     *
     * @param pointer
     */
    onPreInputEvent(pointer) { return false; }

    /**
     * Called by InputAdapter when an InputEvent resolves and is not an Alt input.
To handle events for Alt inputs, refer to onAltInputEvent().
Returns true if the event should be consumed. If consumed, the event will
not propagate to trigger other events.
     *
     * @param pointer
     */
    onInputEvent(pointer) { return false; }

    /**
     * Called by InputAdapter when an InputEvent resolves and is an Alt input.
To handle events for non-Alt inputs, refer to onInputEvent().
Returns true if the event should be consumed. If consumed, the event will
not propagate to trigger other events.
     *
     * @param pointer
     */
    onAltInputEvent(pointer) { return false; }

    /**
     * Called by InputAdapter when a DblInputEvent resolves. The input is
assumed by a non-Alt input, since only non-Alt inputs can trigger this
event.
Returns true if the event should be consumed. If consumed, the event will
not propagate to trigger other events.
     *
     * @param pointer
     */
    onDblInputEvent(pointer) { return false; }

    /**
     * Called by InputAdapter when input moves. The input is called before drag
logic.
Returns true if the event should be consumed. If consumed, the event will
not propagate to trigger other events (i.e. Dragging events).
     *
     * @param pointer
     */
    onMoveInputEvent(pointer) { return false; }

    /**
     * Called by InputAdapter before a drag begins. The input could be either
an Alt or non-Alt input.
Returns true if the event should be consumed. If consumed, the event will
not propagate to trigger other events, and then it will continue the drag
input events for the current handler only.
     
NOTE: A drag does not start immediately on move. There is a radius to
compensate for mobile users. Therefore pointer.x and pointer.y refer to
the offset position. To get the starting pointer position, use
pointer.getInputEventPosition().
     *
     * @param pointer
     */
    onDragStart(pointer) { return false; }

    /**
     * Called by InputAdapter while dragging moves. The input could be either
an Alt or non-Alt input.
Will always be called after onDragStart() and will be followed by
onDragStop() when complete.
     *
     * @param pointer
     */
    onDragMove(pointer) {}

    /**
     * Called by InputAdapter after a drag ends. The input could be either an
Alt or non-Alt input.
Will always be called after onDragStart(). Although onDragMove may be
called in-between, it is not guaranteed.
     *
     * @param pointer
     */
    onDragStop(pointer) {}

    /**
     * Called by InputAdapter after an InputEvent ends.
     *
     * @param pointer
     */
    onPostInputEvent(pointer) {}

    /**
     * Called by InputAdapter when zoom changes.
Returns true if event is consumed (zoom will not be applied).
     *
     * @param pointer
     * @param zoomValue
     * @param prevValue
     */
    onZoomChange(pointer, zoomValue, prevValue)
    {
        return false;
    }
}

export default AbstractInputHandler;
