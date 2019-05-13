class Importer
{
    constructor() {}

    /**
     * Try to import the target file. Assumes that isValidFile() returns true.
     * 
     * @param {String} fileName the name of the target file
     * @param {String} fileType the associated file extension
     * @param {String} fileData the file content to import
     * @returns {Promise} a Promise that resolves if imported without errors
     */
    importFileData(fileName, fileType, fileData)
    {
        return Promise.resolve(fileData);
    }
    
    getDataType() { return 'text'; }
}
export default Importer;
