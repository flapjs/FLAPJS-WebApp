import GraphNodeInputHandler from '../inputs/GraphNodeInputHandler.js';
import GraphEdgeInputHandler from '../inputs/GraphEdgeInputHandler.js';
import InputContext from 'util/input/InputContext.js';

import GraphNode from 'graph2/element/GraphNode.js';

const DEFAULT_MOVE_MODE_FIRST = true;

class InputController
{
    constructor()
    {
        this._trashMode = false;
        this._moveMode = DEFAULT_MOVE_MODE_FIRST;
        this._nodeOnly = false;
        this._moveModeFirst = DEFAULT_MOVE_MODE_FIRST;
        this._handlingInput = false;

        this._target = {
            source: null,
            type: null
        };
        this._activeTarget = {
            source: null,
            type: null,
            input: true
        };
        this._immediateTarget = {
            source: null,
            type: null
        };

        this._inputContext = new InputContext();
        this._graphController = null;
        this._selectionBox = null;
        this._labelFormatter = null;

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
    }

    setGraphController(graphController)
    {
        this._graphController = graphController;
        return this;
    }

    setSelectionBox(selectionBox)
    {
        this._selectionBox = selectionBox;
        return this;
    }

    setLabelFormatter(labelFormatter)
    {
        this._labelFormatter = labelFormatter;
        return this;
    }

    setMoveMode(flag)
    {
        this._moveMode = flag;
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

    initialize()
    {
        const graphController = this._graphController;
        if (!graphController) throw new Error('Must set graph controller before init');
        const selectionBox = this._selectionBox;
        if (!selectionBox) throw new Error('Must set selection box before init');
        const labelFormatter = this._labelFormatter;
        if (!labelFormatter) throw new Error('Must set label formatter before init');

        this._inputContext
            .addInputHandler(this)
            .addInputHandler(new GraphEdgeInputHandler(this, graphController, labelFormatter))
            .addInputHandler(new GraphNodeInputHandler(this, graphController, selectionBox, labelFormatter));
    }

    update()
    {
        // There's nothing to do yet...
    }

    destroy()
    {
        this._inputContext.clearInputHandlers();
    }

    /** @override */
    onPreInputEvent(pointer)
    {
        this._handlingInput = true;
        this._moveMode = !pointer.getInputAdapter().isAltInput();

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
    isMoveMode() { return this._moveModeFirst ? this._moveMode : !this._moveMode; }
    isNodeEventsOnly() { return this._nodeOnly; }
    isMoveModeFirst() { return this._moveModeFirst; }

    isHandlingInput() { return this._handlingInput; }
    getInputContext() { return this._inputContext; }
}

export default InputController;