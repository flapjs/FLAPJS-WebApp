import Importer from './Importer.js';

class CustomImporter extends Importer
{
    constructor(parser)
    {
        super();
        this._parser = parser;
    }

    /** @override */
    importFromFile(fileName, fileData)
    {
        return new Promise((resolve, reject) => 
        {
            try
            {
                const target = this._parser.parse(fileData);
                resolve(target);
            }
            catch (e)
            {
                reject(e);
            }
        });
    }

    getParser() { return this._parser; }
}
export default CustomImporter;
