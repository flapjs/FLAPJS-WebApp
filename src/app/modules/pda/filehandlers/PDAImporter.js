import SessionImporter from 'session/SessionImporter.js';

/**
 * A class that represents a session importer for the PDA module.
 */
class PDAImporter extends SessionImporter
{
    constructor(app, jsonGraphParser)
    {
        super(app);

        this._graphParser = jsonGraphParser;
        this._prevGraphHash = 0;
    }

    /** @override */
    onParseSession(session, fileData)
    {
        return JSON.parse(fileData);
    }

    /** @override */
    onPreImportSession(session)
    {
        const currentModule = session.getCurrentModule();
        const graphController = currentModule.getGraphController();
        const graph = graphController.getGraph();
        this._prevGraphHash = graph.getHashCode(true);

        // TODO: this should not be here, this should exist somewhere in graphController
        if (!graph.isEmpty())
        {
            session.getApp().getUndoManager().captureEvent();
        }
    }

    /** @override */
    onImportSession(session, sessionData)
    {
        const currentModule = session.getCurrentModule();
        const graphController = currentModule.getGraphController();
        const machineController = currentModule.getMachineController();
        const graph = graphController.getGraph();

        this._graphParser.parse(sessionData['graphData'], graph);

        loadMachineFromData(currentModule, graphController, machineController, sessionData['machineData']);
    }

    /** @override */
    onPostImportSession(session)
    {
        const currentModule = session.getCurrentModule();
        const graphController = currentModule.getGraphController();
        const graph = graphController.getGraph();

        // Compares the graph hash before and after import, captures event if they are not equal
        const nextGraphHash = graph.getHashCode(true);
        if (this._prevGraphHash !== nextGraphHash)
        {
            // TODO: this should not be here
            session.getApp().getUndoManager().captureEvent();
        }
    }
}

/**
 * Sets all of the details pertaining to the module (and the machine)
 *
 * @private
 * @param  {GraphController} graphController        the controller for the graph to be constructed
 * @param  {MachineController} machineController    the controller for the machine to be constructed
 * @param  {Object} machineData                     the machine data to be parsed
 */
function loadMachineFromData(graphController, machineController, machineData)
{
    const machineType = machineData.type;
    if (machineType) machineController.setMachineType(machineType);
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

export default PDAImporter;
