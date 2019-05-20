import {ONESHOT_MODE} from 'experimental/tooltip/TooltipView.js';

class TooltipManager
{
    constructor()
    {
        this._tooltips = [];

        this._transitionMode = ONESHOT_MODE;
    }

    setTransitionMode(transitionMode)
    {
        this._transitionMode = transitionMode;
        return this;
    }

    addTooltip(tooltip)
    {
        this._tooltips.push(tooltip);
        return this;
    }

    //DuckType(SessionListener)
    onSessionStart(session)
    {

    }

    //DuckType(SessionListener)
    onSessionStop(session)
    {
        this._tooltips.length = 0;
        this._transitionMode = ONESHOT_MODE;
    }

    getTransitionMode() { return this._transitionMode; }
    getTooltips() { return this._tooltips; }
    hasTooltips() { return this._tooltips.length > 0; }
}

export default TooltipManager;
