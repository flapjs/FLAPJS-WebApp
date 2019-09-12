import SessionExporter from 'session/SessionExporter.js';

import JSONFileIcon from 'components/iconset/flat/JSONFileIcon.js';
import { JSON as JSONGraphParser } from 'modules/fsa2/FSAGraphParser.js';

import FSAGraph from 'modules/fsa2/graph/FSAGraph.js';
import {EMPTY_SYMBOL} from 'modules/fsa2/machine/FSA.js';
import {EMPTY_CHAR, SYMBOL_SEPARATOR} from 'modules/fsa2/graph/element/FSAEdge.js';
import GraphLayout from 'modules/fsa2/GraphLayout.js';

class REToFSAExporter extends SessionExporter
{
    constructor() { super('.fsa.json'); }

    onExportSession(session, dst)
    {
        const currentModule = session.getCurrentModule();
        const machineController = currentModule.getMachineController();
        const machine = machineController.getEquivalentFSA();

        const graph = new FSAGraph();
        setGraphToFSA(graph, machine);
        const graphData = JSONGraphParser.objectify(graph);

        dst['graphData'] = graphData;
        dst['machineData'] = {
            type: 'NFA',
            symbols: []
        };
    }
    
    /** @override */
    getIconClass() { return JSONFileIcon; }
    /** @override */
    getLabel() { return I18N.toString('file.export.convertfsa'); }
    /** @override */
    getTitle() { return I18N.toString('file.export.convertfsa'); }
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
