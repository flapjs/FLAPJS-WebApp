class Importer
{
    constructor() {}

    /**
     * Try to import the target file. Assumes that isValidFile() returns true.
     * 
     * @param {string} fileName The name of the target file.
     * @param {string} fileType The associated file extension.
     * @param {string} fileData The file content to import.
     * @returns {Promise} A Promise that resolves if imported without errors.
     */
    importFileData(fileName, fileType, fileData)
    {
        return Promise.resolve(fileData);
    }
    
    getDataType() { return 'text'; }

    getFileTypes()
    {
        throw new Error('Importer must define accepted file types by overriding getFileTypes().');
    }
}
export default Importer;
