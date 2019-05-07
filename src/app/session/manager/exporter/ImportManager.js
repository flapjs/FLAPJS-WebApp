export const JSON_FILE_TYPE = 'json';

class ImportManager
{
    constructor()
    {
        this._importers = new Map();
    }

    clear()
    {
        this._importers.clear();
    }

    addImporter(fileType, importer)
    {
        if (this._importers.has(fileType))
        {
            const importers = this._importers.get(fileType);
            importers.push(importer);
        }
        else
        {
            this._importers.set(fileType, [importer]);
        }
        return this;
    }

    removeImporter(fileType, importer)
    {
        if (this._importers.has(fileType))
        {
            const importers = this._importers.get(fileType);
            importers.splice(importers.indexOf(importer), 1);
        }
        return this;
    }

    clearImportersByFileType(fileType)
    {
        this._importers.delete(fileType);
    }

    getImportersByFileType(fileType)
    {
        return this._importers.getFileType(fileType);
    }

    getImportersByFile(filename, fileData)
    {
        const dst = [];
        const dotIndex = filename.lastIndexOf('.');
        if (dotIndex < 0) return dst;
        const fileType = filename.substring(dotIndex + 1);
        const importers = this.getImportersByFileType(fileType);
        for (const importer of importers)
        {
            if (importer.isValidFile(filename, fileData))
            {
                dst.push(importer);
            }
        }
        return dst;
    }

    getFileTypes() { return this._importers.keys(); }

    isEmpty() { return this._importers.size <= 0; }
}

export default ImportManager;
