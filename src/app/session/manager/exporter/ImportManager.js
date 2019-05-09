import {FILE_TYPE_JSON} from './JSONImporter.js';

const DEFAULT_FILE_TYPE = FILE_TYPE_JSON;

class ImportManager
{
    constructor()
    {
        this._importers = new Map();
    }

    /**
     * Removes all importers and file types.
     */
    clear()
    {
        this._importers.clear();
    }

    /**
     * Add importer for the file type. If there are multiple importers sharing the same type, they will be
     * given a chance to process in the order they were registered.
     * 
     * @param {String} fileType     the last-most file extension, prepended with a dot (for example, 'fileName.config.json' would still be '.json')
     * @param {Importer} importer   the importer associated with the file type
     * @returns {this}
     */
    addImporter(fileType, importer)
    {
        if (!fileType.startsWith('.')) throw new Error('File types must start with \'.\'');

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

    /**
     * Remove importer for the file type. If the importer is the last for the file
     * type, the file type is removed as an available importable file type.
     * 
     * @param {String} fileType     the file type to remove the importer from
     * @param {Importer} importer   the importer to remove
     * @returns {this}
     */
    removeImporter(fileType, importer)
    {
        if (this._importers.has(fileType))
        {
            const importers = this._importers.get(fileType);
            importers.splice(importers.indexOf(importer), 1);
            if (importers.length <= 0)
            {
                this._importers.delete(fileType);
            }
        }
        return this;
    }

    /**
     * Tries to import the file blob with registered importers.
     * 
     * @param {File} fileBlob the file to import
     * @returns {Promise} a Promise that resolves if imported without errors
     */
    tryImportFile(fileBlob)
    {
        return new Promise((resolve, reject) =>
        {
            if (!fileBlob) throw new Error('Unable to import null file');
            if (!(fileBlob instanceof File)) throw new Error('Unable to import object as file');

            const reader = new FileReader();

            // If file reading successful...
            reader.addEventListener('load', event =>
            {
                const fileName = fileBlob.name;
                const fileData = event.target.result;
                const importers = this.getImportersByFile(fileName, fileData);
                if (importers && importers.length > 0)
                {
                    importers.reduce((acc, value) => acc.catch(e => value.importFromFile(fileName, fileData)), Promise.reject())
                        .then(result => resolve(result))
                        .catch(e => reject(e));
                }
                else
                {
                    reject(new Error('Failed to import file \'' + fileName + '\''));
                }
            });

            // If file reading failed...
            reader.addEventListener('error', event =>
            {
                reject(new Error('Unable to import file: ' + event.target.error.code));
            });

            // Now let's begin the read...
            reader.readAsText(fileBlob);
        });
    }

    /**
     * Removes all importers for the file type. Essentially, the file type will no longer
     * be an option for importing.
     * 
     * @param {String} fileType the file type to remove all importers
     */
    clearImportersByFileType(fileType)
    {
        this._importers.delete(fileType);
    }

    /**
     * Gets the associated importers (in order) for the file type.
     * 
     * @param {String} fileType the importers' file type
     * @returns {Array.<Importer>} a mutable array of importers
     */
    getImportersByFileType(fileType)
    {
        return this._importers.get(fileType);
    }

    /**
     * Returns an immutable array of importers that can import the file. This is determined by isValidFile().
     * 
     * @param {String} fileName the name of the imported target file
     * @param {String} fileData the content of the imported target file
     * @returns {Array.<Importer>} an immutable array of valid importers for the file
     */
    getImportersByFile(fileName, fileData)
    {
        const dst = [];
        const dotIndex = fileName.lastIndexOf('.');
        if (dotIndex < 0) return dst;
        const fileType = fileName.substring(dotIndex);
        const importers = this.getImportersByFileType(fileType);
        for (const importer of importers)
        {
            if (importer.isValidFile(fileName, fileData))
            {
                dst.push(importer);
            }
        }
        return dst;
    }

    /**
     * Gets all available file types with importers.
     * 
     * @returns {Iterable.<String>} a collection of file types
     */
    getFileTypes() { return this._importers.keys(); }

    /**
     * Gets the <input> accept attribute string for all available file types with importeres.
     * 
     * @returns {String} a string with all valid file exts
     */
    getFileTypesAsAcceptString()
    {
        const dst = Array.from(this._importers.keys());
        dst.unshift(DEFAULT_FILE_TYPE);
        return dst.join(',');
    }

    /**
     * @returns {Boolean} whether there are available importers of any file type
     */
    isEmpty() { return this._importers.size <= 0; }
}

export default ImportManager;
