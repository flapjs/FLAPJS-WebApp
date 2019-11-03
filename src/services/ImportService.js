import AbstractService from './AbstractService.js';

import ImportManager from '@flapjs/systems/file/import/ImportManager.js';

class ImportService extends AbstractService
{
    constructor()
    {
        super();
        
        this.importManager = new ImportManager();
    }

    /** @override */
    load(session)
    {
        super.load(session);

        const currentModule = session.module;
        if (currentModule)
        {
            if (Array.isArray(currentModule.imports))
            {
                for(const importer of currentModule.imports)
                {
                    this.importManager.addImporter(importer, ...importer.getFileTypes());
                } 
            }
        }

        session.importManager = this.importManager;
        return this;
    }

    /** @override */
    unload(session)
    {
        super.unload(session);

        this.importManager.clear();

        delete session.importManager;
        return this;
    }
}

export default ImportService;
