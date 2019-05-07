const EDGE_RADIUS = 12;
const EDGE_RADIUS_SQU = EDGE_RADIUS * EDGE_RADIUS;
const ENDPOINT_RADIUS = 6;
const ENDPOINT_RADIUS_SQU = ENDPOINT_RADIUS * ENDPOINT_RADIUS;

class GraphPicker
{
    constructor()
    {
        this.target = null;
        this.targetType = '';

        this.initialTarget = null;
        this.initialTargetType = '';

        this._prevX = 0;
        this._prevY = 0;

        this._pickHandlers = new Map();
    }

    addPickHandler(pickHandler)
    {
        this._pickHandlers.set(pickHandler.getTargetType(), pickHandler);
        return this;
    }

    removePickHandler(pickHandler)
    {
        this._pickHandlers.delete(pickHandler.getTargetType());
        return this;
    }

    getPickHandler(targetType)
    {
        return this._pickHandlers.get(targetType);
    }

    setInitialTarget(target, type)
    {
        this.initialTarget = target;
        this.initialTargetType = type;
    }

    updateHoverTarget(graph, x, y)
    {
        if (this._prevX !== x || this._prevY !== y)
        {
            this._prevX = x;
            this._prevY = y;

            //Update target
            this.updateTarget(graph, x, y);

            //HACK: to make the cursor look like a pointer when targeting
            if (this.hasTarget())
            {
                document.body.style.cursor = 'pointer';
            }
            else
            {
                document.body.style.cursor = 'auto';
            }
        }
    }

    updateInitialTarget(graph, x, y)
    {
        this.updateTarget(graph, x, y);
        this.setInitialTarget(this.target, this.targetType);
    }

    updateTarget(graph, x, y)
    {
        for(const pickHandler of this._pickHandlers.values())
        {
            if (this.target = pickHandler.getTargetAt(graph, x, y))
            {
                this.targetType = pickHandler.getTargetType();
                return;
            }
        }

        this.target = null;
        this.targetType = 'none';

        return this.target;
    }

    clearTarget()
    {
        this.target = null;
        this.targetType = 'none';
    }

    hasTarget()
    {
        return this.target != null;
    }

    isTarget(target)
    {
        return this.target == target;
    }

    getPickHandlers()
    {
        return this._pickHandlers.values();
    }
}

export default GraphPicker;
