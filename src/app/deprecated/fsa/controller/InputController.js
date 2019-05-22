import AbstractInputController from 'modules/abstract/AbstractInputController.js';

import ViewportInputHandler from './ViewportInputHandler.js';
import GraphPicker from './GraphPicker.js';

import GraphNodeInputHandler from './inputhandler/GraphNodeInputHandler.js';
import GraphEdgeInputHandler from './inputhandler/GraphEdgeInputHandler.js';
import GraphEndpointInputHandler from './inputhandler/GraphEndpointInputHandler.js';
import GraphInitialInputHandler from './inputhandler/GraphInitialInputHandler.js';
import SelectionBoxInputHandler from './inputhandler/SelectionBoxInputHandler.js';
import GraphNodeCreateInputHandler from './inputhandler/GraphNodeCreateInputHandler.js';

const DEFAULT_SHOULD_DESTROY_POINTLESS_EDGE = true;

class InputController extends AbstractInputController
{
    constructor(module, inputAdapter)
    {
        super(module, inputAdapter);

        inputAdapter.addInputHandler(this);
        inputAdapter.addInputHandler(new ViewportInputHandler());

        this._picker = new GraphPicker();

        this._graphController = null;

        //Used to check if target needs to be updated for the hover effect
        this.prevPointerX = 0;
        this.prevPointerY = 0;

        //Make sure this is always false when moving endpoints
        this.isNewEdge = false;

        //Used to change render to follow pointer when moving initial marker
        this.ghostInitialMarker = null;

        //Whether to destroy pointless edges
        this.shouldDestroyPointlessEdges = DEFAULT_SHOULD_DESTROY_POINTLESS_EDGE;

        //Swap left to right clicks and vice versa on anything else but Macs
        this._swapMouseScheme = true;//!navigator.platform.startsWith("Mac");

        //Used to determine whether the target should be destroyed because of trash mode
        this._trashMode = false;

        this._disabled = false;

        //TODO: this works, it's just not attached to anything
        this._snapToGrid = false;
        this._snapSize = 48;

        this._inputHandlers = [
            new GraphNodeInputHandler(),
            new GraphEdgeInputHandler(),
            new GraphEndpointInputHandler(),
            new GraphInitialInputHandler(),
            new SelectionBoxInputHandler(this._picker),
            new GraphNodeCreateInputHandler()
        ];
    }

    /** @override */
    initialize(module)
    {
        super.initialize(module);

        this._graphController = module.getGraphController();
    }

    /** @override */
    destroy(module)
    {
        super.destroy(module);
    }

    /** @override */
    update(module)
    {
        super.update(module);

        const graph = this._graphController.getGraph();
        const picker = this._picker;
        const x = this._inputAdapter.getPointerX();
        const y = this._inputAdapter.getPointerY();

        if (x != this.prevPointerX || y != this.prevPointerY)
        {
            this.prevPointerX = x;
            this.prevPointerY = y;

            //Update target
            picker.updateTarget(graph, x, y);

            //HACK: to make the cursor look like a pointer when targeting
            if (picker.hasTarget())
            {
                document.body.style.cursor = 'pointer';
            }
            else
            {
                document.body.style.cursor = 'auto';
            }
        }
    }

    setDisabled(disabled)
    {
        this._disabled = disabled;
    }

    isDisabled()
    {
        return this._disabled;
    }

    /** @override */
    onPreInputEvent(pointer)
    {
        if (this._disabled) return super.onPreInputEvent(pointer);

        const inputController = this;
        const graphController = this._graphController;

        const graph = graphController.getGraph();
        const picker = inputController.getPicker();
        picker.updateTarget(graph, pointer.x, pointer.y);
        picker.setInitialTarget(picker.target, picker.targetType);

        const target = picker.initialTarget;
        const targetType = picker.initialTargetType;

        if (picker.hasSelection())
        {
            //Unselect everything is clicked on something other than nodes...
            if (targetType != 'node' || !picker.isTargetInSelection(target))
            {
                picker.clearSelection();
            }
        }

        //Disable all graph input when in step-by-step mode
        if (graphController.tester.getStepByStepMode())
        {
            //Consume event!
            return true;
        }

        /** @override */
        return super.onPreInputEvent(pointer);
    }

    /** @override */
    onInputEvent(pointer)
    {
        if (this._disabled) return super.onInputEvent(pointer);

        const inputController = this;
        const graphController = this._graphController;
        const picker = inputController.getPicker();
        picker.updateTarget(graphController.getGraph(), pointer.x, pointer.y);
        const target = picker.initialTarget;
        const targetType = picker.initialTargetType;

        for(const handler of this._inputHandlers)
        {
            if (handler.isTargetable(inputController, pointer, target, targetType) &&
        handler.onAction(inputController, graphController, pointer, target))
            {
                return true;
            }
        }

        /** @override */
        return super.onInputEvent(pointer);
    }

    /** @override */
    onDblInputEvent(pointer)
    {
        if (this._disabled) return super.onDblInputEvent(pointer);

        const inputController = this;
        const graphController = this._graphController;
        const picker = inputController.getPicker();
        const target = picker.initialTarget;
        const targetType = picker.initialTargetType;

        //Make sure it is not in trash mode
        if (inputController.isTrashMode())
        {
            graphController.emit('tryCreateWhileTrash');
            return false;
        }

        for(const handler of this._inputHandlers)
        {
            if (handler.isTargetable(inputController, pointer, target, targetType) &&
        handler.onDblAction(inputController, graphController, pointer, target))
            {
                return true;
            }
        }

        /** @override */
        return super.onDblInputEvent(pointer);
    }

    /** @override */
    onDragStart(pointer)
    {
        if (this._disabled) return super.onDragStart(pointer);

        const inputController = this;
        const graphController = this._graphController;
        const picker = inputController.getPicker();
        const target = picker.initialTarget;
        const targetType = picker.initialTargetType;

        //Make sure it is not in new edge mode
        inputController.isNewEdge = false;

        //Make sure it is not in trash mode
        if (inputController.isTrashMode())
        {
            graphController.emit('tryCreateWhileTrash');
            return false;
        }

        for(const handler of this._inputHandlers)
        {
            if (handler.isTargetable(inputController, pointer, target, targetType) &&
        handler.onDragStart(inputController, graphController, pointer, target))
            {
                return true;
            }
        }

        /** @override */
        return super.onDragStart(pointer);
    }

    /** @override */
    onDragMove(pointer)
    {
        if (this._disabled) return super.onDragMove(pointer);

        const inputController = this;
        const graphController = this._graphController;
        const picker = inputController.getPicker();
        const target = picker.initialTarget;
        const targetType = picker.initialTargetType;

        for(const handler of this._inputHandlers)
        {
            if (handler.isTargetable(inputController, pointer, target, targetType) &&
        handler.onDragMove(inputController, graphController, pointer, target))
            {
                return true;
            }
        }

        /** @override */
        return super.onDragMove(pointer);
    }

    /** @override */
    onDragStop(pointer)
    {
        if (this._disabled) return super.onDragStop(pointer);

        const inputController = this;
        const graphController = this._graphController;
        const picker = inputController.getPicker();
        picker.updateTarget(graphController.getGraph(), pointer.x, pointer.y);
        const target = picker.initialTarget;
        const targetType = picker.initialTargetType;

        for(const handler of this._inputHandlers)
        {
            if (handler.isTargetable(inputController, pointer, target, targetType) &&
        handler.onDragStop(inputController, graphController, pointer, target))
            {
                return true;
            }
        }

        /** @override */
        return super.onDragStop(pointer);
    }

    /** @override */
    onPostInputEvent(pointer)
    {
        if (this._disabled) return super.onPostInputEvent(pointer);

        const inputController = this;
        const graphController = this._graphController;
        const graph = graphController.getGraph();
        const picker = inputController.getPicker();

        picker.clearTarget();
        picker.updateTarget(graph, pointer.x, pointer.y);

        /** @override */
        super.onPostInputEvent(pointer);
    }

    setTrashMode(enabled)
    {
        this._trashMode = enabled;
    }

    isTrashMode()
    {
        return this._trashMode;
    }

    setInputScheme(shouldInputFirst)
    {
        this._swapMouseScheme = !shouldInputFirst;
    }

    getInputScheme()
    {
        return this._swapMouseScheme;
    }

    isMoveMode()
    {
        const result = this._inputAdapter.isAltInput();
        return this._swapMouseScheme ? !result : result;
    }

    isDragging()
    {
        return this._inputAdapter.isDragging();
    }

    isActionMode()
    {
        return this._inputAdapter.isPointerActive() ?
        //Is considered an input when NOT moving or when creating a new edge...
            this.isNewEdge || !this.isMoveMode() :
        //If not active, just show default input...
            !this._swapMouseScheme;
    }

    getPicker()
    {
        return this._picker;
    }
}

export default InputController;
