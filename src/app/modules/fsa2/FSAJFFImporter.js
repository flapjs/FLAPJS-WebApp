import XMLImporter from 'session/manager/exporter/XMLImporter.js';

export const FILE_TYPE_JFF = '.jff';

class FSAJFFImporter extends XMLImporter
{
    constructor(fsaModule, jffGraphParser)
    {
        super();

        this._module = fsaModule;
        this._graphParser = jffGraphParser;
    }

    /** @override */
    importFromFile(fileName, fileData)
    {
        return super.importFromFile(fileName, fileData)
            .then(result =>
            {
                const currentModule = this._module;
                const graphController = currentModule.getGraphController();
                const graph = graphController.getGraph();
                const prevGraphHash = graph.getHashCode(true);

                // TODO: this should not be here, this should exist somewhere in graphController
                if (!graph.isEmpty())
                {
                    currentModule.getApp().getUndoManager().captureEvent();
                }

                this._graphParser.parse(result, graph);
                const projectName = fileName.substring(0, fileName.length - FILE_TYPE_JFF.length);
                currentModule.getApp().getSession().setProjectName(projectName);

                // compares GraphHash before and after import, captures event if they are not equal
                const nextGraphHash = graph.getHashCode(true);
                if (prevGraphHash !== nextGraphHash)
                {
                    // TODO: this should not be here
                    currentModule.getApp().getUndoManager().captureEvent();
                }

                return currentModule;
            });
    }
    
    getGraphParser() { return this._graphParser; }
}

export default FSAJFFImporter;
