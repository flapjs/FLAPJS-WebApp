import JSONImporter, { FILE_TYPE_JSON } from 'session/manager/exporter/JSONImporter.js';

export const FILE_META_EXT = '.pda' + FILE_TYPE_JSON;

/**
 * Sets all of the details pertaining to the module (and the machine)
 *
 * @param  {PDAModule} currentModule                the current module to be modified
 * @param  {GraphController} graphController        the controller for the graph to be constructed
 * @param  {MachineController} machineController    the controller for the machine to be constructed
 * @param  {Object} machineData                     the machine data to be parsed
 */
function loadMachineFromData(currentModule, graphController, machineController, machineData)
{
    const customSymbols = machineData.symbols;
    if (customSymbols && Array.isArray(customSymbols))
    {
        machineController.clearCustomSymbols();
        for(const symbol of customSymbols)
        {
            machineController.addCustomSymbol(symbol);
        }
    }
    const statePrefix = machineData.statePrefix;
    if (statePrefix)
    {
        graphController.getGraphLabeler().setDefaultNodeLabelPrefix(statePrefix);
    }
}

class PDAImporter extends JSONImporter
{
    constructor(pdaModule, jsonGraphParser)
    {
        super();

        this._module = pdaModule;
        this._graphParser = jsonGraphParser;
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

                const machineController = currentModule.getMachineController();
                // const metadata = '_metadata' in result ? result['_metadata'] : {};
                this._graphParser.parse(result['graphData'], graph);

                loadMachineFromData(currentModule, graphController, machineController, result['machineData']);

                const projectName = fileName.substring(0, fileName.length - FILE_META_EXT.length);
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

    /** @override */
    isValidFile(fileName, fileData)
    {
        return fileName.endsWith(FILE_META_EXT) && super.isValidFile(fileName, fileData);
    }

    getGraphParser() { return this._graphParser; }
}

export default PDAImporter;
