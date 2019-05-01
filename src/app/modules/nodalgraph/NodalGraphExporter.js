import AbstractGraphExporter from 'session/manager/export/AbstractGraphExporter.js';

import { JSON as JSONGraphParser } from 'graph/parser/NodalGraphParser.js';
import { downloadText } from 'util/Downloader.js';

import JSONFileIcon from 'components/iconset/flat/JSONFileIcon.js';

class NodalGraphExporter extends AbstractGraphExporter
{
    constructor() { super(); }

    fromJSON(data, module)
    {
        const graphController = module.getGraphController();
        const graph = graphController.getGraph();

        const metadata = '_metadata' in data ? data['_metadata'] : {};
        const newGraph = JSONGraphParser.parse(data.graphData, graph);

        //HACK: this should be calculated elsewhere
        const machineData = data.machineData;
        const machineName = machineData.name;
        if (machineName) module.getApp().getSession().setProjectName(machineName);

        return newGraph;
    }

    toJSON(graphData, module)
    {
        const graphController = module.getGraphController();

        const dst = {};
        dst['_metadata'] = {
            module: module.getModuleName(),
            version: process.env.VERSION + ':' + module.getModuleVersion(),
            timestamp: new Date().toString()
        };
        dst['graphData'] = graphData;
        dst['machineData'] = {
            name: module.getApp().getSession().getProjectName()
        };
        return dst;
    }

    /** @override */
    importFromData(data, module)
    {
        this.fromJSON(data, module);
    }

    /** @override */
    exportToData(module)
    {
        const graph = module.getGraphController().getGraph();
        const graphData = JSONGraphParser.objectify(graph);
        const result = this.toJSON(graphData, module);
        return result;
    }

    /** @override */
    doesSupportData()
    {
        return true;
    }

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
                const data = e.target.result;
                const name = filename.substring(0, filename.length - this.getFileType().length - 1);
                const graph = graphController.getGraph();
                const prevGraphHash = graph.getHashCode(true);

                //TODO: this should not be here, this should exist somewhere in graphController
                if (!graph.isEmpty())
                {
                    module.getApp().getUndoManager().captureEvent();
                }

                try
                {
                    const jsonData = JSON.parse(data);

                    this.fromJSON(jsonData, module);

                    module.getApp().getSession().setProjectName(name);

                    resolve();
                }
                catch (e)
                {
                    reader.abort();
                    reject(e);
                }
                finally
                {
                    const nextGraphHash = graph.getHashCode(true);
                    if (prevGraphHash !== nextGraphHash)
                    {
                        module.getApp().getUndoManager().captureEvent();
                    }
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
        const graphData = JSONGraphParser.objectify(graph);
        const dst = this.toJSON(graphData, module);
        const jsonString = JSON.stringify(dst);
        downloadText(filename + '.' + this.getFileType(), jsonString);
    }

    /** @override */
    doesSupportFile()
    {
        return true;
    }

    /** @override */
    canImport(module)
    {
        return true;
    }

    /** @override */
    canExport(module)
    {
        return !module.getGraphController().getGraph().isEmpty();
    }

    /** @override */
    getTitle()
    {
        return I18N.toString('file.export.machine.hint');
    }

    /** @override */
    getLabel()
    {
        return I18N.toString('file.export.machine');
    }

    /** @override */
    getFileType()
    {
        return 'json';
    }

    /** @override */
    getIconClass()
    {
        return JSONFileIcon;
    }
}

export default NodalGraphExporter;
