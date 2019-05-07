import AbstractInputHandler from 'util/input/AbstractInputHandler.js';
import { lerp } from 'util/MathHelper.js';
import {EVENT_SOURCE_INITIAL_MARKER} from '../renderer/InitialMarkerRenderer.js';
import {EVENT_SOURCE_NODE} from 'graph/renderer/GraphNodeInputHandler.js';

export const GRAPH_EVENT_INITIAL_MARKER_CHANGE = 'initial-marker-change';

const INITIAL_MARKER_POSITION_INTERPOLATION_DELTA = 0.6;

class InitialMarkerInputHandler extends AbstractInputHandler
{
    constructor(inputController, graphController)
    {
        super();

        this._inputController = inputController;
        this._graphController = graphController;

        this._ghostMarker = null;
        this._cachedMarkerTarget = null;
        this._cachedPointer = {x: 0, y: 0};
    }

    /** @override */
    onDragStart(pointer)
    {
        const inputController = this._inputController;
        const currentTargetType = inputController.getCurrentTargetType();
        if (!inputController.isMoveMode()) return false;

        if (currentTargetType === 'initial-marker')
        {
            const currentTargetSource = inputController.getCurrentTargetSource();
            this._ghostMarker = currentTargetSource;
            this._cachedMarkerTarget = currentTargetSource.getInitialMarkerTarget();
            this._cachedPointer.x = pointer.x;
            this._cachedPointer.y = pointer.y;

            currentTargetSource.setInitialMarkerTarget(pointer);

            inputController.bindActiveTarget(currentTargetSource, EVENT_SOURCE_INITIAL_MARKER, false);
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

        if (targetType === EVENT_SOURCE_INITIAL_MARKER)
        {
            const immediateTargetType = inputController.getImmediateTargetType();
            if (immediateTargetType === EVENT_SOURCE_NODE)
            {
                const immediateTargetSource = inputController.getImmediateTargetSource();

                this._ghostMarker.setInitialMarkerTarget(immediateTargetSource);
            }
            else
            {
                this._cachedPointer.x = lerp(this._cachedPointer.x, pointer.x, INITIAL_MARKER_POSITION_INTERPOLATION_DELTA);
                this._cachedPointer.y = lerp(this._cachedPointer.y, pointer.y, INITIAL_MARKER_POSITION_INTERPOLATION_DELTA);

                if (this._ghostMarker.getInitialMarkerTarget() !== this._cachedPointer)
                {
                    this._ghostMarker.setInitialMarkerTarget(this._cachedPointer);
                }
            }
        }
    }
  
    /** @override */
    onDragStop(pointer)
    {
        const inputController = this._inputController;
        const targetType = inputController.getActiveTargetType();
        const targetSource = inputController.getActiveTargetSource();

        if (targetType === EVENT_SOURCE_INITIAL_MARKER)
        {
            const initialMarkerTarget = targetSource.getInitialMarkerTarget();
            if (!initialMarkerTarget || initialMarkerTarget === this._cachedPointer)
            {
                targetSource.setInitialMarkerTarget(this._cachedMarkerTarget);
            }
            else
            {
                this._graphController.emitGraphEvent(GRAPH_EVENT_INITIAL_MARKER_CHANGE, {target: initialMarkerTarget});
            }
        }
    }
}

export default InitialMarkerInputHandler;