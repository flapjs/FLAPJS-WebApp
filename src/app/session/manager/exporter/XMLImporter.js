import Importer from './Importer.js';

export const FILE_TYPE_XML = '.xml';

class XMLImporter extends Importer
{
    constructor() { super(); }

    /** @override */
    importFromFile(fileName, fileData)
    {
        try
        {
            const xmlData = new DOMParser().parseFromString(fileData, 'text/xml');
            return Promise.resolve(xmlData);
        }
        catch(e)
        {
            return Promise.reject(e);
        }
    }
}

export default XMLImporter;