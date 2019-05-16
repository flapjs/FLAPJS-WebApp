import InputHandler from './InputHandler.js';

class GraphElementInputHandler extends InputHandler
{
    constructor(targetType)
    {
        super();

        if (!targetType)
        {
            throw new Error('Missing target type for graph element input handler');
        }

        this._targetType = targetType;
    }

    /** @override */
    isTargetable(inputController, pointer, target, targetType)
    {
        if (targetType === this._targetType)
        {
            return true;
        }

        return false;
    }
  
    getTargetType()
    {
        return this._targetType;
    }
}

export default GraphElementInputHandler;
