import Importer from 'session/manager/exporter/Importer.js';

export default class FSAImporter extends Importer
{
    constructor(graphParser)
    {
        super();

        this._graphParser = graphParser;
    }

    /**
   * @override
   * @param  {String} filename    the name of the imported file
   * @param  {Object} fileData    the data to import
   * @return {Promise}            the async import call
   */
    importFromFile(filename, fileData)
    {
        return null;
    }
}
