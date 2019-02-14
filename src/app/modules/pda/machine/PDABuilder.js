import AbstractMachineBuilder from 'modules/abstract/AbstractMachineBuilder.js';
import PDA, { EMPTY_SYMBOL, State } from './PDA.js';
import PDANode from 'modules/pda/graph/PDANode.js';
import PDAEdge, { EMPTY_CHAR } from 'modules/pda/graph/PDAEdge.js';

export const ERROR_UNREACHABLE_STATE = "unreachable_state";
export const ERROR_DUPLICATE_STATE = "duplicate_state";
export const ERROR_INCOMPLETE_TRANSITION = "incomplete_transition";

class PDABuilder extends AbstractMachineBuilder
{
  constructor()
  {
    super();

    this._machine = new PDA();
  }

	//Override
	attemptBuild(graph, dst, errors=[], warnings=[])
	{
		errors.length = 0;
		warnings.length = 0;

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
			const srcNode = edge.getSourceNode();
			const dstNode = edge.getDestinationNode();
			if (!edge.isPlaceholder() && srcNode instanceof PDANode && dstNode instanceof PDANode)
			{
				const srcState = dst.getStateByID(srcNode.getGraphElementID());
				const dstState = dst.getStateByID(dstNode.getGraphElementID());
				if (!srcState || !dstState) throw new Error("Cannot find state for edge source/destination nodes - mismatch id");

				const edgeLabelLines = edge.getEdgeLinesFromLabel();
				for (const line of edgeLabelLines)
				{
					if (!line) continue;

          const symbols = edge.getEdgeSymbolsFromLine(line);

          //Translate all labels to symbols
          for(let i = 0; i < symbols.length; ++i)
          {
            let symbol = symbols[i];
            switch(symbol)
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
		for(const [nodeLabel, sharedStates] of nodeLabels.entries())
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
		const unreachables = this.getUnreachableNodes(graph);
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

	getUnreachableNodes(graph)
	{
		const openList = graph.getNodes().slice();
		const index = openList.indexOf(startNode);
		openList.splice(index, 1);

		const queue = [];
		queue.push(startNode);

		while(queue.length > 0)
		{
			const nextNode = queue.pop();

		}

    if (graph.getNodeCount() <= 1) return [];

    const edges = graph.getEdges();
    const nodes = graph.getNodes().slice();
		const startNode = graph.getStartNode();
		const startIndex = nodes.indexOf(startNode);
		if (startIndex < 0) return [];
		nodes.splice(startIndex, 1);

    let nextNodes = [];
    nextNodes.push(startNode);

    while(nextNodes.length > 0)
    {
      const node = nextNodes.pop();
      for(const edge of edges)
      {
        if (edge.getSourceNode() === node)
        {
          const i = nodes.indexOf(edge.getDestinationNode());
          if (i >= 0)
          {
						const nextNode = nodes[i];
            nodes.splice(i, 1);
            nextNodes.push(nextNode);
          }
        }
      }
    }

    return nodes;
	}

	//Override
	getMachine() { return this._machine; }
}

export default PDABuilder;
