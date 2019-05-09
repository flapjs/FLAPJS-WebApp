import { downloadText } from 'util/Downloader.js';

class Exporter
{
    constructor() {}

    /**
     * 
     * @param {String} fileName the name of exported file for target
     * @param {String} target the content to export
     * @returns {Promise} a Promise that resolves if exported without errors
     */
    exportToFile(fileName, target)
    {
        return new Promise((resolve, reject) => 
        {
            try
            {
                downloadText(fileName, target);
                resolve(target);
            }
            catch (e)
            {
                reject(e);
            }
        });
    }

    isValidTarget(target) { return target; }

    getIconClass() { return null; }
    getLabel() { return 'Export to file'; }
    getTitle() { return 'Export'; }
}

export default Exporter;
