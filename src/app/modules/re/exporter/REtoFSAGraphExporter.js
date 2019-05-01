import FSAGraphExporter from 'modules/fsa2/exporter/FSAGraphExporter.js';
import { JSON as JSONGraphParser } from 'modules/fsa/graph/FSAGraphParser.js';

import FSAGraph from 'modules/fsa/graph/FSAGraph.js';
import { EMPTY_SYMBOL } from 'modules/fsa2/machine/FSA.js';
import { EMPTY_CHAR, SYMBOL_SEPARATOR } from 'modules/fsa/graph/FSAEdge.js';
import GraphLayout from 'modules/fsa/graph/GraphLayout.js';
import { downloadText } from 'util/Downloader.js';

class REtoFSAGraphExporter extends FSAGraphExporter
{
    constructor() { super(); }

    /** @override */
    toJSON(graphData, module)
    {
        const dst = {};
        dst['_metadata'] = {
            module: module.getModuleName(),
            version: process.env.VERSION + ':' + module.getModuleVersion(),
            timestamp: new Date().toString()
        };
        dst['graphData'] = graphData;
        dst['machineData'] = {
            name: module.getApp().getSession().getProjectName(),
            type: 'NFA',
            symbols: []
        };
        return dst;
    }

    /** @override */
    doesSupportData()
    {
        return false;
    }

    /** @override */
    exportToFile(filename, module)
    {
        const machine = module.getMachineController().getEquivalentFSA();
        const graph = new FSAGraph();
        setGraphToFSA(graph, machine);
        const graphData = JSONGraphParser.objectify(graph);
        const dst = this.toJSON(graphData, module);
        const jsonString = JSON.stringify(dst);
        downloadText(filename + '.' + this.getFileType(), jsonString);
    }

    /** @override */
    doesSupportFile()
    {
        return true;
    }

    /** @override */
    canImport(module)
    {
        return false;
    }

    /** @override */
    canExport(module)
    {
        return module.getMachineController().getMachineExpression().length > 0;
    }

    /** @override */
    getLabel()
    {
        return I18N.toString('file.export.convertfsa');
    }
}

function setGraphToFSA(graph, machine)
{
    graph.clear();

    if (machine.getStateCount() <= 0) return;

    //Add all states
    let stateMap = new Map();
    let node;
    for (const state of machine.getStates())
    {
        node = graph.createNode(0, 0);
        node.setNodeLabel(state.getStateLabel());
        if (machine.isFinalState(state)) node.setNodeAccept(true);
        stateMap.set(state, node);
    }

    //Add all transitions
    let edge, from, to, read;
    for (let transition of machine.getTransitions())
    {
        from = stateMap.get(transition.getSourceState());
        to = stateMap.get(transition.getDestinationState());
        read = [];
        for (const symbol of transition.getSymbols())
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

export default REtoFSAGraphExporter;
