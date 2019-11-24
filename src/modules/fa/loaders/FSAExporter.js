import SessionExporter from '@flapjs/session/helper/SessionExporter.js';

import { FileJSONIcon } from '@flapjs/components/icons/Icons.js';

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
        const graphController = session.graphService.graphController;
        const graph = graphController.getGraph();
        const graphData = this._graphParser.compose(graph);

        dst['graphData'] = graphData;
        /*
        const machineController = currentModule.getMachineController();
        dst['machineData'] = {
            type: machineController.getMachineType(),
            symbols: machineController.getCustomSymbols(),
            statePrefix: graphController.getGraphLabeler().getDefaultNodeLabelPrefix()
        };
        */
    }

    /** @override */
    getIconClass() { return FileJSONIcon; }

    /** @override */
    getLabel() { return 'file.export.machine'; }

    /** @override */
    getTitle() { return 'file.export.machine.hint'; }
}

export default FSAExporter;
