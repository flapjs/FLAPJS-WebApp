import * as MathHelper from '@flapjs/util/MathHelper.js';

class ModuleSession
{
    constructor(id = MathHelper.uuid())
    {
        this.id = id;
        this.panels = [];
    }

    addPanel(panelElement)
    {
        this.panels.push(panelElement);
    }

    reset()
    {
        this.panels.length = 0;
    }
}

export default ModuleSession;
