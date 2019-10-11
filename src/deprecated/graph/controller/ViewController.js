import ViewportAdapter from '../input/ViewportAdapter.js';
import InputAdapter from '../input/InputAdapter.js';

import ControllerChangeHandler from './ControllerChangeHandler.js';

const SMOOTH_OFFSET_DAMPING = 0.4;
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;

class ViewController
{
    constructor()
    {
        this._viewportAdapter = new ViewportAdapter()
            .setMinScale(MIN_SCALE)
            .setMaxScale(MAX_SCALE)
            .setOffsetDamping(SMOOTH_OFFSET_DAMPING);
        this._viewChangeHandler = new ControllerChangeHandler(this._viewportAdapter, target => target.getHashCode());
        
        this._inputAdapter = new InputAdapter(this._viewportAdapter);
    }

    initialize()
    {
        this._viewChangeHandler.startListening();
    }

    terminate()
    {
        this._viewChangeHandler.stopListening();
        this._inputAdapter.clearInputHandlers();
    }

    centerView(x = 0, y = 0)
    {
        this._viewportAdapter.setOffset(x, y);
    }

    getInputAdapter()
    {
        return this._inputAdapter;
    }

    getViewportAdapter()
    {
        return this._viewportAdapter;
    }

    getChangeHandler() { return this._viewChangeHandler; }
}

export default ViewController;
