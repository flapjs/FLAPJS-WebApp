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

        const machineController = session.machineService.machineController;
        let machine = machineController.getMachine();
        let machineType = machine.isDeterministic() ? 'DFA' : 'NFA';
        let customSymbols = Array.from(machine.getCustomSymbols());
        dst['machineData'] = {
            type: machineType,
            symbols: customSymbols,
            statePrefix: graphController.getGraphLabeler().getDefaultNodeLabelPrefix()
        };
    }

    /** @override */
    getIconClass() { return FileJSONIcon; }

    /** @override */
    getLabel() { return 'file.export.machine'; }

    /** @override */
    getTitle() { return 'file.export.machine.hint'; }
}

export default FSAExporter;
