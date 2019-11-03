import AbstractService from './AbstractService.js';

import ImportManager from '@flapjs/systems/file/import/ImportManager.js';

class ImportService extends AbstractService
{
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
    load(session)
    {
        super.load(session);

        for(const importer of this.importers)
        {
            this.importManager.addImporter(importer, ...importer.getFileTypes());
        }

        session.importManager = this.importManager;

        return this;
    }

    /** @override */
    unload(session)
    {
        super.unload(session);

        this.importManager.clear();
        this.importers.length = 0;

        delete session.importManager;

        return this;
    }
}

export default ImportService;
