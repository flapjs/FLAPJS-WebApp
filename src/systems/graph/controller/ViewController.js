import ViewportAdapter from '../input/ViewportAdapter.js';
import InputAdapter from '../input/InputAdapter.js';

import AbstractController from '@flapjs/systems/graph/controller/AbstractController.js';

const SMOOTH_OFFSET_DAMPING = 0.4;
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;

class ViewController extends AbstractController
{
    constructor()
    {
        super();

        this._viewportAdapter = new ViewportAdapter()
            .setMinScale(MIN_SCALE)
            .setMaxScale(MAX_SCALE)
            .setOffsetDamping(SMOOTH_OFFSET_DAMPING);
        this._inputAdapter = new InputAdapter(this._viewportAdapter);
    }

    /** @override */
    terminate()
    {
        this._inputAdapter.clearInputHandlers();
    }

    /** @override */
    getControlledHashCode(self)
    {
        return self.getViewportAdapter().getHashCode();
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
