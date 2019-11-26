import SessionExporter from '@flapjs/session/loaders/SessionExporter.js';
import { INSTANCE as FSA_PARSER } from '@flapjs/modules/fa/loaders/FSAGraphParser.js';
import { FileJSONIcon } from '@flapjs/components/icons/Icons.js';

/**
 * A class that represents a session exporter for the FSA module.
 */
class FSAExporter extends SessionExporter
{
    constructor()
    {
        super('.fsa.json');
    }

    /** @override */
    onExportSession(session, dst)
    {
        const graphController = session.graphService.graphController;
        const graph = graphController.getGraph();
        const graphData = FSA_PARSER.compose(graph);
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
