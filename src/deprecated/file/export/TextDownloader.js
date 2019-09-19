import Downloader, { downloadURL } from './Downloader.js';

function getTextDataURI(data)
{
    return 'data:text/plain; charset=utf-8,' + encodeURIComponent(data);
}

class TextDownloader extends Downloader
{
    constructor() { super(); }

    /** @override */
    downloadFile(fileName, downloadType, fileData, opts)
    {
        return downloadURL(fileName, getTextDataURI(fileData)).then(result => fileData);
    }
}

export default TextDownloader;
