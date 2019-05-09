import Exporter from 'session/manager/exporter/Exporter.js';
import { downloadText } from 'util/Downloader.js';
import { FILE_META_EXT } from './REImporter.js';
import REModule from './REModule.js';

import JSONFileIcon from 'components/iconset/flat/JSONFileIcon.js';

class REExporter extends Exporter
{
    constructor()
    {
        super();
    }

    /** @override */
    exportToFile(fileName, target)
    {
        return new Promise((resolve, reject) => 
        {
            const currentModule = target;
            const machineController = currentModule.getMachineController();

            try
            {
                const dst = {};
                dst['_metadata'] = {
                    module: currentModule.getModuleName(),
                    version: process.env.VERSION + ':' + currentModule.getModuleVersion(),
                    timestamp: new Date().toString()
                };
                dst['machineData'] = {
                    expression: machineController.getMachineExpression()
                };
                const jsonString = JSON.stringify(dst);
                
                const outputName = fileName.endsWith(FILE_META_EXT) ? fileName : fileName + FILE_META_EXT;
                downloadText(outputName, jsonString);
                resolve(jsonString);
            }
            catch (e)
            {
                reject(e);
            }
        });
    }

    /** @override */
    isValidTarget(target) { return target instanceof REModule; }

    /** @override */
    getIconClass() { return JSONFileIcon; }
    /** @override */
    getLabel() { return I18N.toString('file.export.machine'); }
    /** @override */
    getTitle() { return I18N.toString('file.export.machine.hint'); }
}

export default REExporter;
