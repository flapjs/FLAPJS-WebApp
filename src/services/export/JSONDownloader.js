import TextDownloader from './TextDownloader.js';

class JSONDownloader extends TextDownloader
{
    constructor() { super(); }

    /** @override */
    downloadFile(fileName, downloadType, fileData, opts)
    {
        return super.downloadFile(fileName, downloadType, JSON.stringify(fileData), opts);
    }
}

export default JSONDownloader;
