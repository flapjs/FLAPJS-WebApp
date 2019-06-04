import AbstractAutoSaveHandler from 'util/storage/AbstractAutoSaveHandler.js';

class AppSaver extends AbstractAutoSaveHandler
{
    constructor(app)
    {
        super();

        this._app = app;
    }

    /** @override */
    onAutoSaveLoad(dataStorage)
    {
        const app = this._app;
        const session = app.getSession();
        const currentModule = session.getCurrentModule();
        const currentModuleName = currentModule.getModuleName();

        const data = dataStorage.getDataAsObject('graph-' + currentModuleName);
        if (data)
        {
            try
            {
                app.getImportManager().tryImportFileFromData('', '.json', data);
            }
            catch(e)
            {
                // Ignore error
            }
        }
    }

    /** @override */
    onAutoSaveUpdate(dataStorage)
    {
        const app = this._app;
        const session = app.getSession();
        const currentModule = session.getCurrentModule();
        const currentModuleName = currentModule.getModuleName();

        try
        {
            app.getExportManager().tryExportTargetToData('session', session)
                .then(result =>
                {
                    dataStorage.setDataAsObject('graph-' + currentModuleName, result.data);
                });
        }
        catch(e)
        {
            // Ignore error
        }
    }

    /** @override */
    onAutoSaveUnload(dataStorage)
    {
        //Don't do anything...
    }

    getApp() { return this._app; }
}

export default AppSaver;
