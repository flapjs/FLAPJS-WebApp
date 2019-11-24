import AbstractService from './AbstractService.js';

import ExportManager from '@flapjs/systems/file/export/ExportManager.js';

class ExportService extends AbstractService
{
    static get SERVICE_KEY() { return 'exportService'; }

    constructor()
    {
        super();
        
        this.exportManager = new ExportManager();
        this.exports = {};
    }

    setExports(moduleExports)
    {
        this.exports = moduleExports;
        return this;
    }

    /** @override */
    load(session)
    {
        super.load(session);

        for(const exportType of Object.keys(this.exports))
        {
            this.exportManager.registerExporter(this.exports[exportType], exportType);
        }

        session.exportManager = this.exportManager;

        return this;
    }

    /** @override */
    unload(session)
    {
        super.unload(session);

        this.exportManager.clear();
        this.exports = {};

        delete session.exportManager;

        return this;
    }
}
ExportService.INSTANCE = new ExportService();
ExportService.CONTEXT = null;

export default ExportService;
