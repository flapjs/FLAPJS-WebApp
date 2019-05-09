class Importer
{
    constructor() {}

    /**
     * Try to import the target file. Assumes that isValidFile() returns true.
     * 
     * @param {String} fileName the name of the target file
     * @param {String} fileData the file content to import
     * @returns {Promise} a Promise that resolves if imported without errors
     */
    importFromFile(fileName, fileData)
    {
        return Promise.resolve(fileData);
    }

    isValidFile(fileName, fileData) { return fileData; }
}
export default Importer;
