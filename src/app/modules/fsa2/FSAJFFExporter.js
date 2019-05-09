import Exporter from 'session/manager/exporter/Exporter.js';
import { downloadText } from 'util/Downloader.js';
import { FILE_TYPE_JFF } from './FSAJFFImporter.js';
import FSAModule from './FSAModule.js';

import XMLFileIcon from 'components/iconset/flat/XMLFileIcon.js';

class FSAJFFExporter extends Exporter
{
    constructor(jffGraphParser)
    {
        super();
        this._graphParser = jffGraphParser;
    }

    /** @override */
    exportToFile(fileName, target)
    {
        return new Promise((resolve, reject) => 
        {
            const currentModule = target;
            const graphController = currentModule.getGraphController();
            const graph = graphController.getGraph();

            try
            {
                const graphData = this._graphParser.objectify(graph);
                const xmlString = new XMLSerializer().serializeToString(graphData);

                const outputName = fileName.endsWith(FILE_TYPE_JFF) ? fileName : fileName + FILE_TYPE_JFF;
                downloadText(outputName, xmlString);
                resolve(xmlString);
            }
            catch (e)
            {
                reject(e);
            }
        });
    }

    /** @override */
    isValidTarget(target) { return target instanceof FSAModule; }

    /** @override */
    getIconClass() { return XMLFileIcon; }
    /** @override */
    getLabel() { return I18N.toString('file.export.jff'); }
    /** @override */
    getTitle() { return I18N.toString('file.export.jff.hint'); }

    getGraphParser() { return this._graphParser; }
}

export default FSAJFFExporter;
