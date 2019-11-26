import SessionExporter from '@flapjs/session/loaders/SessionExporter.js';
import { INSTANCE as FSA_PARSER } from '@flapjs/modules/fa/loaders/FSAGraphParser.js';
import FSAGraph from '@flapjs/modules/fa/graph/FSAGraph.js';
import {EMPTY_SYMBOL} from '@flapjs/modules/fa/machine/FSA.js';
import {EMPTY_CHAR, SYMBOL_SEPARATOR} from '@flapjs/modules/fa/graph/elements/FSAEdge.js';
import GraphLayout from '@flapjs/services/graph/util/GraphLayout.js';
import { FileJSONIcon } from '@flapjs/components/icons/Icons.js';

class REToFSAExporter extends SessionExporter
{
    constructor() { super('.fsa.json'); }

    /** @override */
    onExportSession(session, dst)
    {
        const machineController = session.machineService.machineController;
        const machine = machineController.getEquivalentFSA();

        const graph = new FSAGraph();
        setGraphToFSA(graph, machine);
        const graphData = FSA_PARSER.compose(graph);

        dst['graphData'] = graphData;
        dst['machineData'] = {
            type: 'NFA',
            symbols: []
        };
    }
    
    /** @override */
    getIconClass() { return FileJSONIcon; }
    /** @override */
    getLabel() { return 'file.export.convertfsa'; }
    /** @override */
    getTitle() { return 'file.export.convertfsa'; }
}

function setGraphToFSA(graph, machine)
{
    graph.clear();

    if (machine.getStateCount() <= 0) return;

    //Add all states
    let stateMap = new Map();
    let node;
    for(const state of machine.getStates())
    {
        node = graph.createNode(0, 0);
        node.setNodeLabel(state.getStateLabel());
        if (machine.isFinalState(state)) node.setNodeAccept(true);
        stateMap.set(state, node);
    }

    //Add all transitions
    let edge, from, to, read;
    for(let transition of machine.getTransitions())
    {
        from = stateMap.get(transition.getSourceState());
        to = stateMap.get(transition.getDestinationState());
        read = [];
        for(const symbol of transition.getSymbols())
        {
            if (symbol === EMPTY_SYMBOL)
            {
                read.push(EMPTY_CHAR);
            }
            else
            {
                read.push(symbol);
            }
        }
        edge = graph.createEdge(from, to);
        edge.setEdgeLabel(read.join(SYMBOL_SEPARATOR));
        const formattedEdge = graph.formatEdge(edge);
        if (edge != formattedEdge) graph.deleteEdge(edge);
    }

    //Set start state
    const startState = machine.getStartState();
    graph.setStartNode(stateMap.get(startState));

    //Auto layout graph
    GraphLayout.applyLayout(graph);
}

export default REToFSAExporter;
