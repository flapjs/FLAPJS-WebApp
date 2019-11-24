import AbstractService from './AbstractService.js';

import ImportManager from '@flapjs/services/import/ImportManager.js';

class ImportService extends AbstractService
{
    static get SERVICE_KEY() { return 'importService'; }
    
    constructor()
    {
        super();
        
        this.importManager = new ImportManager();
        this.importers = [];
    }

    addImporter(importer)
    {
        this.importers.push(importer);
        return this;
    }

    /** @override */
    onSessionLoad(session)
    {
        for(const importer of this.importers)
        {
            this.importManager.addImporter(importer, ...importer.getFileTypes());
        }

        session.importManager = this.importManager;
    }

    /** @override */
    onSessionUnload(session)
    {
        this.importManager.clear();
        this.importers.length = 0;

        delete session.importManager;
    }
}
ImportService.INSTANCE = new ImportService();
ImportService.CONTEXT = null;

export default ImportService;
