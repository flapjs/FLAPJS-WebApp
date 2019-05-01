class ExportManager
{
    constructor(app)
    {
        this._app = app;

        this._exporters = [];
    }

    addExporter(exporter)
    {
        this._exporters.push(exporter);
        return this;
    }

    addExporters(exporters)
    {
        for (const exporter of exporters)
        {
            this._exporters.push(exporter);
        }
        return this;
    }

    //DuckType(SessionListener)
    onSessionStart(session)
    {

    }

    //DuckType(SessionListener)
    onSessionStop(session)
    {
        this._exporters.length = 0;
    }

    tryImportFromFile(fileBlob)
    {
        if (!fileBlob) throw new Error('Unable to import null file');
        if (!(fileBlob instanceof File)) throw new Error('Unable to import object as file');

        const currentModule = this._app.getSession().getCurrentModule();
        let result = Promise.reject();
        const fileName = fileBlob.name;
        const exporters = this._exporters;

        for (const exporter of exporters)
        {
            if (exporter.canImport(currentModule) && exporter.doesSupportFile() && fileName.endsWith(exporter.getFileType()))
            {
                result = result.catch(e => exporter.importFromFile(fileBlob, currentModule));
            }
        }

        return result.catch(e => 
        {
            throw new Error('Cannot find valid exporter for file: ' + fileName);
        });
    }

    tryExportToFile(exporter = null)
    {
        const session = this._app.getSession();
        const currentModule = session.getCurrentModule();
        const fileName = session.getProjectName();
        if (!exporter) exporter = this.getDefaultExporter();
        exporter.exportToFile(fileName, currentModule);
    }

    getImportFileTypes()
    {
        const session = this._app.getSession();
        const currentModule = session.getCurrentModule();
        return this._exporters.map(e => 
        {
            if (!e.canImport(currentModule) || !e.doesSupportFile()) return null;
            return '.' + e.getFileType();
        });
    }

    getDefaultExporter()
    {
        return this._exporters[0];
    }

    getExporters()
    {
        return this._exporters;
    }
}

export default ExportManager;
