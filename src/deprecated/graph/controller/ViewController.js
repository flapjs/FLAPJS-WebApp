import ViewportAdapter from '../input/ViewportAdapter.js';
import InputAdapter from '../input/InputAdapter.js';

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
        this._inputAdapter = new InputAdapter(this._viewportAdapter);
    }

    initialize()
    {

    }

    terminate()
    {
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
}

export default ViewController;
