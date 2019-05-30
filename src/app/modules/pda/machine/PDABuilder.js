import AbstractMachineBuilder from 'modules/abstract/AbstractMachineBuilder.js';
import PDA, { EMPTY_SYMBOL, State } from './PDA.js';
import PDANode from '../graph/element/PDANode.js';
import { LINE_SEPARATOR, EMPTY_CHAR } from '../graph/element/PDAEdge.js';
import { getUnreachableNodes } from 'graph2/util/NodeGraphUtils.js';

export const ERROR_UNREACHABLE_STATE = 'unreachable_state';
export const ERROR_DUPLICATE_STATE = 'duplicate_state';
export const ERROR_INCOMPLETE_TRANSITION = 'incomplete_transition';

class PDABuilder extends AbstractMachineBuilder
{
    constructor()
    {
        super();

        this._machine = new PDA();
    }

    /** @override */
    attemptBuildGraph(machine, dst)
    {
        dst.clear();

        //Add all states
        let node;
        for (const state of machine.getStates())
        {
            node = dst.createNode(0, 0);
            node.setNodeLabel(state.getStateLabel());
            if (machine.isFinalState(state))
            {
                node.setNodeAccept(true);
            }
        }

        //Add all transitions
        let edge, from, to, read;
        for (let transition of machine.getTransitions())
        {
            from = this.getFirstGraphNodeByLabel(dst, transition[0]);
            read = transition[1];
            to = this.getFirstGraphNodeByLabel(dst, transition[2]);
            edge = dst.createEdge(from, to);
            edge.setEdgeLabel(read);
            const formattedEdge = dst.formatEdge(edge);
            if (edge != formattedEdge) dst.deleteEdge(edge);
        }

        //Set start state
        const startState = machine.getStartState();
        dst.setStartNode(this.getFirstGraphNodeByLabel(dst, startState));

        return dst;
    }

    /** @override */
    attemptBuildMachine(graph, dst, errors = [], warnings = [])
    {
        errors.length = 0;
        warnings.length = 0;

        const customSymbols = Array.from(dst.getCustomSymbols());
        const customStackSymbols = Array.from(dst.getCustomStackSymbols());
        dst.clear();
        for (const symbol of customSymbols)
        {
            dst.setCustomSymbol(symbol);
        }
        for (const stackSymbol of customStackSymbols)
        {
            dst.setCustomStackSymbol(stackSymbol);
        }

        const nodeLabels = new Map();
        const nodeOutgoings = new Map();
        // const edgeSymbols = new Set();
        const edgePlaceholders = [];
        // const edgeEmpties = [];

        const graphNodes = graph.getNodes();
        const graphEdges = graph.getEdges();
        const graphStart = graph.getStartNode();

        for (const node of graphNodes)
        {
            const nodeLabel = node.getNodeLabel();
            const state = new State(nodeLabel, node);
            dst.addState(state);

            if (node.getNodeAccept())
            {
                dst.setFinalState(state, true);
            }

            if (graphStart === node)
            {
                dst.setStartState(state);
            }

            //Check for duplicate states
            if (nodeLabels.has(nodeLabel)) nodeLabels.get(nodeLabel).push(state);
            else nodeLabels.set(nodeLabel, [state]);

            //For duplicate transitions
            nodeOutgoings.set(state, new Map());
        }

        for (const edge of graphEdges)
        {
            const srcNode = edge.getEdgeFrom();
            const dstNode = edge.getEdgeTo();
            if (!edge.isPlaceholder() && srcNode instanceof PDANode && dstNode instanceof PDANode)
            {
                const srcState = dst.getStateByID(srcNode.getGraphElementID());
                const dstState = dst.getStateByID(dstNode.getGraphElementID());
                if (!srcState || !dstState) throw new Error('Cannot find state for edge source/destination nodes - mismatch id');

                const edgeLabelLines = edge.getEdgeLabel().split(LINE_SEPARATOR);
                for (const line of edgeLabelLines)
                {
                    if (!line) continue;

                    const symbols = edge.getEdgeSymbolsFromLine(line);

                    //Translate all labels to symbols
                    for (let i = 0; i < symbols.length; ++i)
                    {
                        let symbol = symbols[i];
                        switch (symbol)
                        {
                        case EMPTY_CHAR:
                            symbols[i] = EMPTY_SYMBOL;
                            break;
                        default:
                            symbols[i] = symbol;
                        }
                    }

                    //Add to machine...
                    dst.addTransition(srcState, dstState, symbols[0], symbols[1], symbols[2]);
                }
            }
            else
            {
                edgePlaceholders.push(edge);
                continue;
            }
        }

        //Check for duplicate node labels
        for (const [nodeLabel, sharedStates] of nodeLabels.entries())
        {
            if (sharedStates.length > 1)
            {
                warnings.push({
                    name: ERROR_DUPLICATE_STATE,
                    label: nodeLabel,
                    nodes: sharedStates.map(e => e.getSource())
                });
            }
        }

        //Check for incomplete edge
        if (edgePlaceholders.length > 0)
        {
            errors.push({
                name: ERROR_INCOMPLETE_TRANSITION,
                edges: edgePlaceholders
            });
        }

        //Check for unreachable nodes
        const unreachables = getUnreachableNodes(graph);
        if (unreachables && unreachables.length > 0)
        {
            warnings.push({
                name: ERROR_UNREACHABLE_STATE,
                nodes: unreachables
            });
        }

        if (errors.length <= 0)
        {
            //Errors should be empty
            return this._machine;
        }
        else
        {
            //Reasons are stored in errors
            return null;
        }
    }

    /** @override */
    getMachine() { return this._machine; }
}

export default PDABuilder;