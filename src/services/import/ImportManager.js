import { getFileExtFromName } from '@flapjs/util/loader/FileHelper.js';
import TextUploader from './TextUploader.js';

class ImportManager
{
    constructor()
    {
        this._importers = new Map();
        this._metaTypes = new Map();

        this._textUploader = new TextUploader();
    }
    
    /**
     * Add importer for the file type(s). If there are multiple importers sharing the same type, they will be
     * given a chance to process in the order they were registered.
     * 
     * @param {Importer} importer       The importer associated with the file type.
     * @param {...string} fileTypes     The file type preceded by a dot, such as '.txt' or '.config.json'.
     * @returns {this}                  Self for method-chaining.
     */
    addImporter(importer, ...fileTypes)
    {
        for(const fileType of fileTypes)
        {
            this._addFileType(fileType);
            this._importers.get(fileType).push(importer);
        }
        return this;
    }

    /**
     * Remove importer for the file type. If the importer is the last for the file
     * type, the file type is removed as an available importable file type.
     * 
     * @param {Importer} importer   The importer to remove.
     * @param {string} fileType     The file type to remove the importer from.
     * @returns {this}              Self for method-chaining.
     */
    removeImporter(importer, fileType)
    {
        if (this._importers.has(fileType))
        {
            const importers = this._importers.get(fileType);
            importers.splice(importers.indexOf(importer), 1);
            if (importers.length <= 0)
            {
                this._removeFileType(fileType);
            }
        }
        return this;
    }

    /**
     * Removes all importers for the file type. Essentially, the file type will no longer
     * be an option for importing.
     * 
     * @param {string} fileType The file type to remove all importers.
     */
    clearImportersByFileType(fileType)
    {
        this._removeFileType(fileType);
    }

    /**
     * Removes all importers and file types.
     */
    clear()
    {
        this._importers.clear();
        this._metaTypes.clear();
    }

    _addFileType(fileType)
    {
        if (this._importers.has(fileType)) return;

        const fileExtIndex = fileType.lastIndexOf('.');
        if (fileExtIndex < 0) throw new Error('File types must start with \'.\'');

        // Register any file types with additional extensions BEFORE the last one.
        if (fileExtIndex !== 0)
        {
            const fileExt = fileType.substring(fileExtIndex);
            if (this._metaTypes.has(fileExt))
            {
                const metaTypes = this._metaTypes.get(fileExt);
                metaTypes.push(fileType);
                metaTypes.sort((a, b) =>
                {
                    const patternA = a.match(/\./g);
                    const patternB = a.match(/\./g);
                    return patternA.length - patternB.length;
                });
            }
            else
            {
                if (!this._importers.has(fileExt)) this._importers.set(fileExt, []);

                this._metaTypes.set(fileExt, [fileType]);
            }
        }

        this._importers.set(fileType, []);
    }

    _removeFileType(fileType)
    {
        this._importers.delete(fileType);

        const fileExtIndex = fileType.lastIndexOf('.');
        if (fileExtIndex !== 0)
        {
            const fileExt = fileType.substring(fileExtIndex);
            const metaTypes = this._metaTypes.get(fileExt);
            metaTypes.splice(metaTypes.indexOf(fileExt), 1);
            if (metaTypes.length <= 0)
            {
                this._metaTypes.delete(fileExt);
            }
        }
    }

    /**
     * Tries to import the file blob with registered importers.
     * 
     * @param {File} fileBlob The file to import.
     * @param {Session} session The current session state.
     * @returns {Promise} A Promise that resolves if imported without errors.
     */
    tryImportFile(fileBlob, session)
    {
        if (!fileBlob) throw new Error('Unable to import null file');
        if (!(fileBlob instanceof File)) throw new Error('Unable to import object as file');

        return this._textUploader.uploadFile(fileBlob)
            .then(result =>
            {
                const fileName = fileBlob.name;
                const fileType = getFileExtFromName(fileName);
                const fileData = result;
                return this.tryImportFileFromData(session, fileName, fileType, fileData);
            })
            .catch(err =>
            {
                throw new Error('Failed to import file: ' + err.message);
            });
    }

    /**
     * Tries to import the file data with registered importers. This is usually used
     * in a chain after tryUploadFile(), since this method processes "uploaded" file
     * data (not file blobs) into objects used by the application.
     * 
     * The file data is outputted by uploaders, which take file blobs.
     * 
     * For ease of use, this entire chain is done by tryImportFile().
     * 
     * @param {Session} session The current session state.
     * @param {string} fileName The name of the target file.
     * @param {string} fileType The type of the target file (usually just the file extension).
     * @param {string} fileData The file data to import.
     * @returns {Promise} A Promise that resolves if imported without errors.
     */
    tryImportFileFromData(session, fileName, fileType, fileData)
    {
        // Find all valid importers
        const importers = [];

        if (this._metaTypes.has(fileType))
        {
            // ...for meta file types...
            const metaTypes = this._metaTypes.get(fileType);
            for (const metaType of metaTypes)
            {
                if (fileName.endsWith(metaType))
                {
                    for(const importer of this.getImportersByFileType(metaType))
                    {
                        importers.push({
                            src: importer,
                            type: metaType
                        });
                    }
                }
            }
        }

        // ...for file extensions...
        for(const importer of this.getImportersByFileType(fileType))
        {
            importers.push({
                src: importer,
                type: fileType
            });
        }

        // Try to import them ...
        if (importers && importers.length > 0)
        {
            return importers.reduce(
                (acc, value) => acc.catch(
                    err => value.src.importFileData(session, fileName, value.type, fileData)
                ),
                Promise.reject());
        }
        else
        {
            throw new Error('No valid importers found for file');
        }
    }

    /**
     * Gets the associated importers (in order) for the file type.
     * 
     * @param {string} fileType The importers' file type.
     * @returns {Array.<Importer>} A mutable array of importers.
     */
    getImportersByFileType(fileType)
    {
        return this._importers.get(fileType);
    }

    /**
     * Gets all available file types with importers.
     * 
     * @returns {Iterable.<string>} A collection of file types.
     */
    getFileTypes() { return this._importers.keys(); }

    /**
     * Gets the <input> accept attribute string for all available file types with importeres.
     * 
     * @returns {string} A string with all valid file exts.
     */
    getFileTypesAsAcceptString()
    {
        const dst = Array.from(this._importers.keys());
        return dst.join(',');
    }

    /**
     * @returns {boolean} Whether there are available importers of any file type.
     */
    isEmpty() { return this._importers.size <= 0; }
}

export default ImportManager;
