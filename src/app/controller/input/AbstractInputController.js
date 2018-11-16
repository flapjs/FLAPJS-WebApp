/**
 * Used by InputAdapter to handle input event logic.
 */
class AbstractInputController
{
  /**
   * Called by InputAdapter before an ActionEvent begins.
   * Returns true if the event should be consumed. If consumed, the event will
   * not begin.
   */
  onPreActionEvent(pointer) { return false; }

  /**
   * Called by InputAdapter when an ActionEvent resolves and is not an Alt
   * action. To handle input for Alt actions, refer to onAltActionEvent().
   * Returns true if the event should be consumed. If consumed, the event will
   * not propagate to other trigger other events.
   */
  onActionEvent(pointer) { return false; }

  /**
   * Called by InputAdapter when an ActionEvent resolves and is an Alt action.
   * To handle input for non-Alt actions, refer to onActionEvent().
   * Returns true if the event should be consumed. If consumed, the event will
   * not propagate to other trigger other events.
   */
  onAltActionEvent(pointer) { return false; }

  /**
   * Called by InputAdapter when a DblActionEvent resolves. The action is
   * assumed by a non-Alt action, since only non-Alt actions can trigger this
   * event.
   * Returns true if the event should be consumed. If consumed, the event will
   * not propagate to other trigger other events.
   */
  onDblActionEvent(pointer) { return false; }

  /**
   * Called by InputAdapter before a drag begins. The action could be either
   * an Alt or non-Alt action.
   * Returns true if the event should be consumed. If consumed, the event will
   * not propagate to other trigger other events, nor continue the drag action.
   */
  onDragStart(pointer) { return false; }

  /**
   * Called by InputAdapter while dragging moves. The action could be either
   * an Alt or non-Alt action.
   * Will always be called after onDragStart() and will be followed by
   * onDragStop() when complete.
   */
  onDragMove(pointer) {}

  /**
   * Called by InputAdapter after a drag ends. The action could be either an
   * Alt or non-Alt action.
   * Will always be called after onDragStart(). Although onDragMove may be
   * called in-between, it is not guaranteed.
   */
  onDragStop(pointer) {}

  /**
   * Called by InputAdapter after an ActionEvent ends.
   */
  onPostActionEvent(pointer) {}

  /**
   * Called by InputAdapter when zoom changes.
   * Returns true if the zoom change can be applied to the current viewport.
   */
  onZoomChange(pointer, zoomValue, prevValue)
  {
    return true;
  }
}

export default AbstractInputController;
