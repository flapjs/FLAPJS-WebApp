import SessionExporter from 'session/SessionExporter.js';

import JSONFileIcon from 'components/iconset/flat/JSONFileIcon.js';

/**
 * A class that represents a session exporter for the FSA module.
 */
class FSAExporter extends SessionExporter
{
    constructor(jsonGraphParser)
    {
        super('.fsa.json');
        this._graphParser = jsonGraphParser;
    }

    /** @override */
    onExportSession(session, dst)
    {
        const currentModule = session.getCurrentModule();
        const graphController = currentModule.getGraphController();
        const machineController = currentModule.getMachineController();
        const graph = graphController.getGraph();
        const graphData = this._graphParser.objectify(graph);

        dst['graphData'] = graphData;
        dst['machineData'] = {
            type: machineController.getMachineType(),
            symbols: machineController.getCustomSymbols(),
            statePrefix: graphController.getGraphLabeler().getDefaultNodeLabelPrefix()
        };
    }

    /** @override */
    getIconClass() { return JSONFileIcon; }
    /** @override */
    getLabel() { return I18N.toString('file.export.machine'); }
    /** @override */
    getTitle() { return I18N.toString('file.export.machine.hint'); }
}

export default FSAExporter;
