class GraphImporter
{
    constructor(module)
    {
        this._module = module;
    }

    importFile(fileBlob, module)
    {
        if (!fileBlob) throw new Error('Unable to import null file');
        if (!(fileBlob instanceof File)) throw new Error('Unable to import object as file');

        let result = Promise.reject();
        const fileName = fileBlob.name;
        const exporters = module.getGraphController().getGraphExporters();

        for(const exporter of exporters)
        {
            if (exporter.canImport() && exporter.doesSupportFile() && fileName.endsWith(exporter.getFileType()))
            {
                result = result.catch(e => exporter.importFromFile(fileBlob, module));
            }
        }

        return result.catch(e => 
        {
            throw new Error('Cannot find valid exporter for file: ' + fileName);
        });
    }

    importData(data, module)
    {
        if (!data) throw new Error('Unable to import null data');

        let result = Promise.reject();
        const exporters = module.getGraphController().getGraphExporters();

        for(const exporter of exporters)
        {
            if (exporter.canImport() && exporter.doesSupportData())
            {
                result = result.catch(e => exporter.importFromData(data, module));
            }
        }

        return result.catch(e => 
        {
            throw new Error('Cannot find valid exporter for data: ' + JSON.stringify(data));
        });
    }

    getImportFileTypes()
    {
        return this._module.getGraphController().getGraphExporters().map(e => 
        {
            if (!e.canImport() || !e.doesSupportFile()) return null;
            return '.' + e.getFileType();
        });
    }
}

export default GraphImporter;
