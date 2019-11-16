import SessionExporter from '@flapjs/session/helper/SessionExporter.js';

import { RunningManIcon as JSONFileIcon } from '@flapjs/components/icons/Icons.js';

/**
 * A class that represents a session exporter for the PDA module.
 */
class PDAExporter extends SessionExporter
{
    constructor(jsonGraphParser)
    {
        super('.pda.json');
        this._graphParser = jsonGraphParser;
    }

    /** @override */
    onExportSession(session, dst)
    {
        const currentModule = session.getCurrentModule();
        const graphController = currentModule.getGraphController();
        // const machineController = currentModule.getMachineController();
        const graph = graphController.getGraph();
        const graphData = this._graphParser.objectify(graph);

        dst['graphData'] = graphData;
        /*
        dst['machineData'] = {
            symbols: machineController.getCustomSymbols(),
            statePrefix: graphController.getGraphLabeler().getDefaultNodeLabelPrefix()
        };
        */
    }

    /** @override */
    getIconClass() { return JSONFileIcon; }
    /** @override */
    getLabel() { return 'file.export.machine'; }
    /** @override */
    getTitle() { return 'file.export.machine.hint'; }
}

export default PDAExporter;
