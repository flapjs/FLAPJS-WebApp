import * as MathHelper from '@flapjs/util/MathHelper.js';

import RenderManager from '@flapjs/session/RenderManager.js';

class ModuleSession
{
    constructor(sessionManager = null, id = MathHelper.uuid())
    {
        this.id = id;

        this.renders = new RenderManager();

        this.sessionManager = sessionManager;
    }

    reset()
    {
        this.renders.clear();
    }
}

export default ModuleSession;
