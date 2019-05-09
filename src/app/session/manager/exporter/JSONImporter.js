import Importer from './Importer.js';

export const FILE_TYPE_JSON = '.json';

class JSONImporter extends Importer
{
    constructor() { super(); }

    /** @override */
    importFromFile(fileName, fileData)
    {
        try
        {
            const jsonData = JSON.parse(fileData);
            return Promise.resolve(jsonData);
        }
        catch(e)
        {
            return Promise.reject(e);
        }
    }
}

export default JSONImporter;