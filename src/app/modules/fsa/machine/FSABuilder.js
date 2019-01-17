import AbstractMachineBuilder from 'modules/abstract/AbstractMachineBuilder.js';
import FSA, { EMPTY_SYMBOL, State } from './FSA.js';
import FSANode from 'modules/fsa/graph/FSANode.js';
import FSAEdge, { EMPTY_CHAR } from 'modules/fsa/graph/FSAEdge.js';

class FSABuilder extends AbstractMachineBuilder
{
	constructor()
	{
		super();

		this._machine = new FSA();
	}

	//Override
	onGraphChange(graph)
	{
		this.attemptBuild(graph, this._machine, this._errors, this._warnings);
	}

	attemptBuild(graph, dst, errors=[], warnings=[])
	{
		errors.length = 0;
		warnings.length = 0;

		const deterministic = dst.isDeterministic();
		dst.clear();

		const nodeLabels = new Map();
		const edgeSymbols = new Set();
		const edgePlaceholders = [];
		const edgeEmpties = [];

		const graphNodes = graph.getNodes();
		const graphEdges = graph.getEdges();
		const graphStart = graph.getStartNode();

		for (const node of graphNodes)
		{
			const nodeLabel = node.getNodeLabel();
			const state = new State(nodeLabel, node.getGraphElementID());
			dst.addState(state);

			if (node.getNodeAccept())
			{
				dst.setFinalState(state, true);
			}

			if (graphStart === node)
			{
				dst.setStartState(state);
			}

			//Check for duplicates
			if (nodeLabels.has(nodeLabel)) nodeLabels.get(nodeLabel).push(state);
			else nodeLabels.set(nodeLabel, [state]);
		}

		for (const edge of graphEdges)
		{
			const srcNode = edge.getSourceNode();
			const dstNode = edge.getDestinationNode();
			if (!edge.isPlaceholder() && srcNode instanceof FSANode && dstNode instanceof FSANode)
			{
				const srcState = dst.getStateByID(srcNode.getGraphElementID());
				const dstState = dst.getStateByID(dstNode.getGraphElementID());
				if (!srcState || !dstState) throw new Error("Cannot find state for edge source/destination nodes - mismatch id");

				const edgeSymbols = edge.getEdgeSymbolsFromLabel();
				for (const symbol of edgeSymbols)
				{
          if (symbol == EMPTY_CHAR)
          {
            edgeEmpties.push(edge);
          }
          else
          {
            edgeSymbols.add(symbol);
          }

          //Translate all labels to symbols
          let transitionSymbol;
          switch(symbol)
          {
            case EMPTY_CHAR:
              transitionSymbol = EMPTY_SYMBOL;
              break;
            default:
              transitionSymbol = symbol;
          }

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
    //Check for duplicate/missing edge labels
    //Check for edge placeholders
    //Check for empty transitions

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

	//Override
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
