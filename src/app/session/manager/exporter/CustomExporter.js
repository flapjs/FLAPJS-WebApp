import Exporter from './Exporter.js';
import { downloadText } from 'util/Downloader.js';

class CustomExporter extends Exporter
{
    constructor(parser)
    {
        super();
        this._parser = parser;
    }

    /** @override */
    exportToFile(fileName, target)
    {
        return new Promise((resolve, reject) => 
        {
            try
            {
                const fileData = this._parser.compose(target);
                downloadText(fileName, fileData);
                resolve(fileData);
            }
            catch (e)
            {
                reject(e);
            }
        });
    }
    
    getParser() { return this._parser; }
}
export default CustomExporter;
