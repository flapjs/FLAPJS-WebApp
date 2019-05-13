import Exporter from 'session/manager/exporter/Exporter.js';
import { downloadText } from 'util/Downloader.js';
import { FILE_META_EXT } from './PDAImporter.js';
import PDAModule from './PDAModule.js';

import JSONFileIcon from 'components/iconset/flat/JSONFileIcon.js';

class PDAExporter extends Exporter
{
    constructor(jsonGraphParser)
    {
        super();
        this._graphParser = jsonGraphParser;
    }

    /** @override */
    exportToFile(fileName, target)
    {
        return new Promise((resolve, reject) => 
        {
            const currentModule = target;
            const graphController = currentModule.getGraphController();
            const machineController = currentModule.getMachineController();
            const graph = graphController.getGraph();

            try
            {
                const graphData = this._graphParser.objectify(graph);

                const dst = {};
                dst['_metadata'] = {
                    module: currentModule.getModuleName(),
                    version: process.env.VERSION + ':' + currentModule.getModuleVersion(),
                    timestamp: new Date().toString()
                };
                dst['graphData'] = graphData;
                dst['machineData'] = {
                    symbols: machineController.getCustomSymbols(),
                    statePrefix: graphController.getGraphLabeler().getDefaultNodeLabelPrefix()
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
    isValidTarget(target) { return target instanceof PDAModule; }

    /** @override */
    getIconClass() { return JSONFileIcon; }
    /** @override */
    getLabel() { return I18N.toString('file.export.machine'); }
    /** @override */
    getTitle() { return I18N.toString('file.export.machine.hint'); }

    getGraphParser() { return this._graphParser; }
}

export default PDAExporter;
