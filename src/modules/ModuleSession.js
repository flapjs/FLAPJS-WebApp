import * as MathHelper from '@flapjs/util/MathHelper.js';

class ModuleSession
{
    constructor(sessionManager = null, id = MathHelper.uuid())
    {
        this.id = id;
        this.panels = [];

        this.sessionManager = sessionManager;
    }

    reset()
    {
        this.panels.length = 0;
    }

    addPanel(panelElement)
    {
        this.panels.push(panelElement);
        return this;
    }
}

export default ModuleSession;
