import AbstractService from './AbstractService.js';

import ExportManager from '@flapjs/systems/file/export/ExportManager.js';

class ExportService extends AbstractService
{
    constructor()
    {
        super();
        
        this.exportManager = new ExportManager();
    }

    /** @override */
    load(session)
    {
        super.load(session);

        const currentModule = session.module;
        if (currentModule && typeof currentModule.exports === 'object')
        {
            for(const exportType of Object.keys(currentModule.exports))
            {
                this.exportManager.registerExporter(currentModule.exports[exportType], exportType);
            }
        }

        session.exportManager = this.exportManager;
        return this;
    }

    /** @override */
    unload(session)
    {
        super.unload(session);

        this.exportManager.clear();

        delete session.exportManager;
        return this;
    }
}

export default ExportService;
