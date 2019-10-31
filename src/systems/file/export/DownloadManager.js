import TextDownloader from './TextDownloader.js';
import SVGImageDownloader from './SVGImageDownloader.js';
import JSONDownloader from './JSONDownloader.js';

/**
 * Used by ExportManager to manage download types. This handles the file/data type, whereas
 * export handles the kind of content represented by that data.
 */
class DownloadManager
{
    constructor()
    {
        this._downloaders = new Map();

        this.addDownloader(new TextDownloader(), 'text');
        this.addDownloader(new SVGImageDownloader(), 'image');
        this.addDownloader(new JSONDownloader(), 'object');
    }

    /**
     * Add downloader for the download type(s). If there are multiple downloaders sharing the same type, they will be
     * given a chance to process in the order they were registered.
     * 
     * @param {Downloader} downloader       The downloader associated with the download type.
     * @param {...string} downloadTypes     The download type preceded by a dot, such as '.txt' or '.config.json'.
     * @returns {this}                      Self for method-chaining.
     */
    addDownloader(downloader, ...downloadTypes)
    {
        for (const downloadType of downloadTypes)
        {
            if (this._downloaders.has(downloadType))
            {
                this._downloaders.get(downloadType).push(downloader);
            }
            else
            {
                this._downloaders.set(downloadType, [downloader]);
            }
        }
        return this;
    }

    /**
     * Remove downloader for the download type. If the downloader is the last for the download
     * type, the download type is removed as an available downloadable download type.
     * 
     * @param {Downloader} downloader   The downloader to remove.
     * @param {string} downloadType     The download type to remove the downloader from.
     * @returns {this}                  Self for method-chaining.
     */
    removeDownloader(downloader, downloadType)
    {
        if (this._downloaders.has(downloadType))
        {
            const downloaders = this._downloaders.get(downloadType);
            downloaders.splice(downloaders.indexOf(downloader), 1);
            if (downloaders.length <= 0)
            {
                this._downloaders.delete(downloadType);
            }
        }
        return this;
    }

    /**
     * Removes all downloaders for the download type. Essentially, the download type will no longer
     * be an option for downloading.
     * 
     * @param {string} downloadType The download type to remove all downloaders.
     */
    clearDownloadersByDownloadType(downloadType)
    {
        this._downloaders.delete(downloadType);
    }

    /**
     * Removes all downloaders and download types.
     */
    clear()
    {
        this._downloaders.clear();
    }

    /**
     * Tries to download the export data with registered downloaders.
     * 
     * @param {string} fileName The name of the exported file.
     * @param {string} downloadType The type of file data (NOT the file extension).
     * @param {string} fileData The file data to download.
     * @param {object} opts Any additional arguments to pass to the downloader.
     * @returns {Promise} A Promise that resolves if downloaded without errors.
     */
    tryDownloadFile(fileName, downloadType, fileData, opts)
    {
        // Find all valid downloaders
        const downloaders = this.getDownloadersByDownloadType(downloadType);

        // Try to download them ...
        if (downloaders && downloaders.length > 0)
        {
            return downloaders.reduce(
                (acc, value) => acc.catch(
                    e => value.downloadFile(fileName, downloadType, fileData, opts)
                ),
                Promise.reject());
        }
        else
        {
            throw new Error('No valid downloaders found for download type');
        }
    }

    /**
     * Gets the associated downloaders (in order) for the download type.
     * 
     * @param {string} downloadType The downloaders' download type.
     * @returns {Array.<Downloader>} A mutable array of downloaders.
     */
    getDownloadersByDownloadType(downloadType)
    {
        return this._downloaders.get(downloadType);
    }

    /**
     * Gets all available download types with downloaders.
     * 
     * @returns {Iterable.<string>} A collection of download types.
     */
    getDownloadTypes() { return this._downloaders.keys(); }

    /**
     * @returns {boolean} Whether there are available downloaders of any download type.
     */
    isEmpty() { return this._downloaders.size <= 0; }
}

export default DownloadManager;
