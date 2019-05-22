import GraphNode from 'graph2/element/GraphNode.js';

const DEFAULT_MOVE_MODE_FIRST = true;

class InputController
{
    constructor()
    {
        this._trashMode = false;
        this._nodeOnly = false;
        this._moveModeFirst = DEFAULT_MOVE_MODE_FIRST;
        this._handlingInput = false;

        /*
            This is the current target for the event. If this is a multi-stage event,
            such as dragging, then this will only refer to the first target, the source
            of the event.
        */
        this._target = {
            source: null,
            type: null
        };

        /*
            This is the active target. It can only be manually set by binding source and
            type through bindActiveTarget(). This allows future input handling to ignore
            this target for intersection tests, etc.

            NOTE: You must bind AND unbind the active target.
        */
        this._activeTarget = {
            source: null,
            type: null,
            input: true
        };

        /*
            This is the immediate target under the cursor. Regardless of input event, this
            will always refer to the element directly intersecting the cursor. The active target
            with the proper options may be ignored as possible candidates.
        */
        this._immediateTarget = {
            source: null,
            type: null
        };

        // This is only used if set.
        this._selectionBox = null;

        // Although not used here, it is used to connect to components.
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
    }

    setSelectionBox(selectionBox)
    {
        this._selectionBox = selectionBox;
        return this;
    }

    setTrashMode(flag)
    {
        this._trashMode = flag;
        return this;
    }

    setNodeEventsOnly(flag)
    {
        this._nodeOnly = flag;
        return this;
    }

    setMoveModeFirst(flag)
    {
        this._moveModeFirst = flag;
        return this;
    }

    /** @override */
    onPreInputEvent(pointer)
    {
        this._handlingInput = true;

        this.updateCurrentTarget(this._immediateTarget.source, this._immediateTarget.type);
        return false;
    }

    /** @override */
    onPostInputEvent(pointer)
    {
        this.updateCurrentTarget(null, null);
        this._handlingInput = false;
    }

    onMouseOver(e)
    {
        const target = e.target;
        const value = target['value'];
        this._immediateTarget.source = value.source;
        this._immediateTarget.type = value.type;
		
        // Although you can access this, it cannot be a property for "active" targets.
        // This is because those properties are used for comparison and equality. The
        // extra data could be used for that, but it's up to you to manage that.
        this._immediateTarget.data = value;
    }

    onMouseOut(e)
    {
        this._immediateTarget.source = null;
        this._immediateTarget.type = null;

        this._immediateTarget.data = null;
    }

    bindActiveTarget(targetSource, targetType, pointerEvent = true)
    {
        this._activeTarget.source = targetSource;
        this._activeTarget.type = targetType;
        this._activeTarget.input = pointerEvent;
    }

    unbindActiveTarget()
    {
        this._activeTarget.source = null;
        this._activeTarget.type = null;
        this._activeTarget.input = false;
    }

    updateCurrentTarget(targetSource, targetType)
    {
        this._target.source = targetSource;
        this._target.type = targetType;
    }

    getActiveTargetSource() { return this._activeTarget.source; }
    getActiveTargetType() { return this._activeTarget.type; }
    hasActiveTarget() { return this._activeTarget.type !== null; }

    hasPointerEvents(targetSource)
    {
        if (this._activeTarget.source === targetSource) return this._activeTarget.input;
        if (this._nodeOnly) return targetSource instanceof GraphNode;
        return true;
    }

    getCurrentTargetSource() { return this._target.source; }
    getCurrentTargetType() { return this._target.type; }
    hasCurrentTarget() { return this._target.type !== null; }

    getImmediateTargetSource() { return this._immediateTarget.source; }
    getImmediateTargetType() { return this._immediateTarget.type; }
    hasImmediateTarget() { return this._immediateTarget.type !== null; }

    isTrashMode() { return this._trashMode; }
    isMoveMode(inputAdapter) { return !(this._moveModeFirst ^ !inputAdapter.isAltInput()); }
    isNodeEventsOnly() { return this._nodeOnly; }
    isMoveModeFirst() { return this._moveModeFirst; }

    isHandlingInput() { return this._handlingInput; }

    getSelectionBox() { return this._selectionBox; }
}

export default InputController;