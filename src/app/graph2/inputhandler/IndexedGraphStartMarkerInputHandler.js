import AbstractInputHandler from 'util/input/AbstractInputHandler.js';
import { lerp } from 'util/MathHelper.js';

import { EVENT_SOURCE_START_MARKER } from '../renderer/StartMarkerRenderer.js';
import { EVENT_SOURCE_NODE } from '../renderer/NodeRenderer.js';

export const GRAPH_EVENT_START_MARKER_CHANGE = 'start-marker-change';

const START_MARKER_POSITION_INTERPOLATION_DELTA = 0.6;

class GraphStartMarkerInputHandler extends AbstractInputHandler
{
    constructor(inputController, graphController)
    {
        super();

        this._inputController = inputController;
        this._graphController = graphController;

        this._ghostMarker = null;
        this._cachedMarkerTarget = null;
        this._cachedPointer = { x: 0, y: 0 };
    }

    /** @override */
    onDragStart(pointer)
    {
        const inputController = this._inputController;
        const currentTargetType = inputController.getCurrentTargetType();

        if (currentTargetType === EVENT_SOURCE_START_MARKER)
        {
            const currentTargetSource = inputController.getCurrentTargetSource();
            this._cachedMarkerTarget = currentTargetSource;
            this._cachedPointer.x = pointer.x;
            this._cachedPointer.y = pointer.y;
            this._ghostMarker = this._cachedPointer;

            inputController.bindActiveTarget(currentTargetSource, EVENT_SOURCE_START_MARKER, true);
            inputController.setNodeEventsOnly(true);
            return true;
        }

        return false;
    }

    /** @override */
    onDragMove(pointer)
    {
        const inputController = this._inputController;
        const targetType = inputController.getActiveTargetType();

        if (targetType === EVENT_SOURCE_START_MARKER)
        {
            const immediateTargetType = inputController.getImmediateTargetType();
            if (immediateTargetType === EVENT_SOURCE_NODE)
            {
                const immediateTargetSource = inputController.getImmediateTargetSource();

                this._ghostMarker = immediateTargetSource;
            }
            else
            {
                this._cachedPointer.x = lerp(this._cachedPointer.x, pointer.x, START_MARKER_POSITION_INTERPOLATION_DELTA);
                this._cachedPointer.y = lerp(this._cachedPointer.y, pointer.y, START_MARKER_POSITION_INTERPOLATION_DELTA);

                if (this._ghostMarker !== this._cachedPointer)
                {
                    this._ghostMarker = this._cachedPointer;
                }
            }
        }
    }

    /** @override */
    onDragStop(pointer)
    {
        const inputController = this._inputController;
        const targetType = inputController.getActiveTargetType();
        inputController.unbindActiveTarget();

        if (targetType === EVENT_SOURCE_START_MARKER)
        {
            if (!this._ghostMarker || this._ghostMarker === this._cachedPointer)
            {
                // Don't do anything, cause it should already be correct...
            }
            else
            {
                this._graphController.getGraph().setStartNode(this._ghostMarker);
                this._graphController.emitGraphEvent(GRAPH_EVENT_START_MARKER_CHANGE, { target: this._ghostMarker });
            }

            this._ghostMarker = null;
        }
    }

    getGhostMarker() { return this._ghostMarker; }
}

export default GraphStartMarkerInputHandler;