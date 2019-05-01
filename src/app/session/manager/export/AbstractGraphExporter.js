class AbstractGraphExporter
{
    constructor() {}

    importFromData(data, module)
    {
        throw new Error('Unsupported import for type \'' + this.getFileType() + '\'');
    }

    exportToData(module)
    {
        throw new Error('Unsupported export for type \'' + this.getFileType() + '\'');
    }

    doesSupportData()
    {
        return false;
    }

    importFromFile(fileBlob, module)
    {
        throw new Error('Unsupported import for type \'' + this.getFileType() + '\'');
    }

    exportToFile(filename, module)
    {
        throw new Error('Unsupported export for type \'' + this.getFileType() + '\'');
    }

    doesSupportFile()
    {
        return false;
    }

    canImport(module)
    {
        return false;
    }

    canExport(module)
    {
        return true;
    }

    getTitle()
    {
        return this.getLabel();
    }

    getIconClass()
    {
        return null;
    }

    getLabel()
    {
        return 'Export as ' + this.getFileType().toUpperCase();
    }

    getFileType()
    {
        throw new Error('Unknown file type for exporter');
    }
}

export default AbstractGraphExporter;
