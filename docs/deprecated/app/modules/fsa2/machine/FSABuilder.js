import AbstractMachineBuilder from 'modules/abstract/AbstractMachineBuilder.js';
import FSA, { EMPTY_SYMBOL, State } from './FSA.js';
import FSANode from 'modules/fsa2/graph/element/FSANode.js';
import { SYMBOL_SEPARATOR, EMPTY_CHAR } from 'modules/fsa2/graph/element/FSAEdge.js';
import { getUnreachableNodes } from 'graph2/util/NodeGraphUtils.js';

export const ERROR_UNREACHABLE_STATE = 'unreachable_state';
export const ERROR_DUPLICATE_STATE = 'duplicate_state';
export const ERROR_INCOMPLETE_TRANSITION = 'incomplete_transition';
export const ERROR_DUPLICATE_TRANSITION = 'duplicate_transition';
export const ERROR_MISSING_TRANSITION = 'missing_transition';
export const ERROR_EMPTY_TRANSITION = 'empty_transition';

class FSABuilder extends AbstractMachineBuilder
{
    constructor()
    {
        super();

        this._machine = new FSA();
    }

    /** @override */
    attemptBuildGraph(machine, dst)
    {
        dst.clear();

        //Add all states
        const nodeMapping = new Map();
        let node;
        for (const state of machine.getStates())
        {
            node = dst.createNode(0, 0);
            node.setNodeLabel(state.getStateLabel());
            if (machine.isFinalState(state))
            {
                node.setNodeAccept(true);
            }
            nodeMapping.set(state, node);
        }

        //Add all transitions
        let edge, from, to, read;
        for (let transition of machine.getTransitions())
        {
            from = nodeMapping.get(transition.getSourceState());
            if (!from) continue;

            read = transition.getSymbols().join(' ');

            to = nodeMapping.get(transition.getDestinationState());
            if (!to) continue;

            edge = dst.createEdge(from, to);
            edge.setEdgeLabel(read);
        }

        //Set start state
        const startState = machine.getStartState();

        let startNodes = dst.getNodesByLabel(startState);
        if (startNodes && startNodes.length > 0)
        {
            dst.setStartNode(startNodes[0]);
        }

        return dst;
    }

    /** @override */
    attemptBuildMachine(graph, dst, errors = [], warnings = [])
    {
        errors.length = 0;
        warnings.length = 0;

        const deterministic = dst.isDeterministic();
        dst.clear();

        const nodeLabels = new Map();
        const nodeOutgoings = new Map();
        const edgeSymbols = new Set();
        const edgePlaceholders = [];
        const edgeEmpties = [];

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
            if (!edge.isPlaceholder() && srcNode instanceof FSANode && dstNode instanceof FSANode)
            {
                const srcState = dst.getStateByID(srcNode.getGraphElementID());
                const dstState = dst.getStateByID(dstNode.getGraphElementID());
                if (!srcState || !dstState) throw new Error('Cannot find state for edge source/destination nodes - mismatch id');

                const edgeLabelSymbols = edge.getEdgeLabel().split(SYMBOL_SEPARATOR);
                for (const symbol of edgeLabelSymbols)
                {
                    if (!symbol) continue;

                    if (symbol === EMPTY_CHAR)
                    {
                        //For empties
                        edgeEmpties.push(edge);
                    }
                    else
                    {
                        //For used symbol
                        edgeSymbols.add(symbol);
                    }

                    //Translate all labels to symbols
                    let transitionSymbol;
                    switch (symbol)
                    {
                    case EMPTY_CHAR:
                        transitionSymbol = EMPTY_SYMBOL;
                        break;
                    default:
                        transitionSymbol = symbol;
                    }

                    //For duplicate/missing transitions
                    let outSymbols = nodeOutgoings.get(srcState);
                    let outEdges = outSymbols.get(transitionSymbol);
                    if (!outEdges) outSymbols.set(transitionSymbol, outEdges = new Array());
                    outEdges.push(edge);

                    //Add to machine...
                    dst.addTransition(srcState, dstState, transitionSymbol);
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
                errors.push({
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

        if (deterministic)
        {
            //Check for empty transitions
            if (edgeEmpties.length > 0)
            {
                errors.push({
                    name: ERROR_EMPTY_TRANSITION,
                    edges: edgeEmpties
                });
            }

            //Check for duplicate edge labels
            //Check for missing edge labels
            const missingSymbols = [];
            for (const [state, edgeMapping] of nodeOutgoings.entries())
            {
                for (const symbol of edgeSymbols)
                {
                    const edges = edgeMapping.get(symbol);
                    if (edges)
                    {
                        if (edges.length !== 1)
                        {
                            errors.push({
                                name: ERROR_DUPLICATE_TRANSITION,
                                edges: edges,
                                symbol: symbol
                            });
                        }
                    }
                    else
                    {
                        missingSymbols.push(symbol);
                    }
                }

                if (missingSymbols.length > 0)
                {
                    errors.push({
                        name: ERROR_MISSING_TRANSITION,
                        node: state.getSource(),
                        symbols: missingSymbols.slice()
                    });
                    missingSymbols.length = 0;
                }
            }
        }

        if (errors.length <= 0)
        {
            //Errors should be empty
            return dst;
        }
        else
        {
            //Reasons are stored in errors
            return null;
        }
    }

    /** @override */
    getMachine()
    {
        return this._machine;
    }
}

//Representations ->
//Truth

//MachineBuilder
//Graph -> Machine (Compile, then return errors)
//Any changes to graph does not warrant a change to machine
//Machine Changes -> Graph (Apply them as they happen)
//Any change to machine does.
//Machine Conversion -> Graph (Reconstruct the entire graph from machine, then apply layout)

export default FSABuilder;