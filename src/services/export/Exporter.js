/**
 * An object map that represents the processed export data. These are used as arguments
 * for a downloader to further evaluate and then finally download to the client's machine.
 * 
 * Any additional properties are also passed to the downloader.
 * 
 * @typedef {object} ExportData
 * @property {string} name  The file name for the exported object.
 * @property {string} type  The download type (this is NOT the same as export type or file type).
 * @property {*} data       The processed target data to put into a file.
 */

/**
 * A class that exports a specific target to data. The outputs of this class are usually
 * then passed to a downloader.
 */
class Exporter
{
    constructor() {}

    /**
     * Exports the target to an export data object. This is then usually passed to a
     * downloader to process and download to the client's machine.
     * 
     * @param {string} exportType The export type for the target.
     * @param {*} target The target to export.
     * @returns {ExportData} The processed export data that represents the target's current state.
     */
    exportTarget(exportType, target)
    {
        return Promise.resolve({
            name: 'untitled.json',
            type: 'text',
            data: JSON.stringify(target)
        });
    }

    /**
     * The representive icon class for this exporter.
     * 
     * @returns {React.Component} The icon component class.
     */
    getIconClass() { return null; }

    /**
     * The label for the exporter.
     * 
     * @returns {string} The label.
     */
    getLabel() { return 'Export'; }

    /**
     * The hint for the exporter.
     * 
     * @returns {string} The hint.
     */
    getTitle() { return 'Export'; }
}

export default Exporter;
