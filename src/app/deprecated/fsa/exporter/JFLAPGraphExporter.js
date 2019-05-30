import AbstractGraphExporter from './AbstractGraphExporter.js';

import XMLFileIcon from 'deprecated/icons/flat/XMLIcon.js';
import { XML as XMLGraphParser } from 'deprecated/fsa/graph/FSAGraphParser.js';
import { downloadText } from 'util/Downloader.js';

class JFLAPGraphExporter extends AbstractGraphExporter
{
    constructor() { super(); }

    /** @override */
    importFromFile(fileBlob, module)
    {
        return new Promise((resolve, reject) => 
        {
            const filename = fileBlob.name;
            if (!filename.endsWith(this.getFileType()))
            {
                throw new Error('Trying to import invalid file type for \'' + this.getFileType() + '\': ' + filename);
            }

            const reader = new FileReader();
            reader.onload = e => 
            {
                const graphController = module.getGraphController();
                const machineController = module.getMachineController();
                const data = e.target.result;
                const name = filename.substring(0, filename.length - this.getFileType().length - 1);
                const graph = graphController.getGraph();

                //TODO: this should not be here, this should exist somewhere in graphController
                //graphController.emit("userPreImportGraph", graph);
                module.captureGraphEvent();

                try
                {
                    const xmlData = new DOMParser().parseFromString(data, 'text/xml');
                    XMLGraphParser.parse(xmlData, graph);

                    //graphController.emit("userImportGraph", graph);

                    if (machineController)
                    {
                        machineController.setMachineName(name);
                    }

                    resolve();
                }
                catch (e)
                {
                    reader.abort();
                    reject(e);
                }
                finally
                {
                    //graphController.emit("userPostImportGraph", graph);
                    module.captureGraphEvent();
                }
            };

            reader.onerror = e => 
            {
                reject(new Error('Unable to import file: ' + e.target.error.code));
            };

            reader.readAsText(fileBlob);
        });
    }

    /** @override */
    exportToFile(filename, module)
    {
        const graph = module.getGraphController().getGraph();
        const graphData = XMLGraphParser.objectify(graph);
        const xmlString = new XMLSerializer().serializeToString(graphData);
        downloadText(filename + '.' + this.getFileType(), xmlString);
    }

    /** @override */
    doesSupportFile()
    {
        return true;
    }

    /** @override */
    canImport()
    {
        return true;
    }

    /** @override */
    getTitle()
    {
        return I18N.toString('file.export.jff.hint');
    }

    /** @override */
    getLabel()
    {
        return I18N.toString('file.export.jff');
    }

    /** @override */
    getFileType()
    {
        return 'jff';
    }

    /** @override */
    getIconClass()
    {
        return XMLFileIcon;
    }
}

export default JFLAPGraphExporter;
