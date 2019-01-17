import FSAErrorChecker from './FSAErrorChecker.js';
import DFA from 'machine/DFA.js';
import NFA from 'machine/NFA.js';
import Node from 'modules/fsa/graph/FSANode.js';

class FSABuilder
{
  constructor()
  {
    this._machine = new NFA();
    this._machineType = "DFA";
    this._symbols = [];

		this._graph = null;
		this._cachedGraphHash = 0;

		this._errors = [];
		this._warnings = [];

    this._errorChecker = new FSAErrorChecker();

    this.tester = null;
    this.graphController = null;
    this.machineController = null;
  }

  initialize(module)
  {
    this.tester = module.getTestingManager();
    this.graphController = module.getGraphController();
    this.machineController = module.getMachineController();
  }

  destroy()
  {
  }

  update()
  {
    const graph = this.graphController.getGraph();
		this._graph = graph;
		const graphHash = graph.getHashCode(false);
		if (graphHash !== this._cachedGraphHash)
		{
			this._cachedGraphHash = graphHash;
			this.onGraphChange(graph);
		}
  }

  onGraphChange(graph=null)
  {
    if (!this.tester) return;

    this._machine.clear();
    const result = this.toNFA(this._machine);
    for(const s of this._symbols)
    {
      this._machine.newSymbol(s);
    }

    this._errors.length = 0;
    this._warnings.length = 0;
    this._errorChecker.checkErrors(this.tester.shouldCheckError, this.graphController, this.machineController);
    for(const node of this._errorChecker.errorNodes)
    {
      this._errors.push({target: node, targetType: 'node'});
    }
    for(const edge of this._errorChecker.errorEdges)
    {
      this._errors.push({target: edge, targetType: 'edge'});
    }
    for(const node of this._errorChecker.warningNodes)
    {
      this._warnings.push({target: node, targetType: 'node'});
    }
    for(const edge of this._errorChecker.warningEdges)
    {
      this._warnings.push({target: edge, targetType: 'edge'});
    }
  }

  setMachineType(machineType)
  {
    if (this._machineType == machineType) return;

    this._machineType = machineType;

    this.onGraphChange();
  }

  getMachineType()
  {
    return this._machineType;
  }

  addCustomSymbol(symbol)
  {
    this._symbols.push(symbol);

    this.onGraphChange();
  }

  removeCustomSymbol(symbol)
  {
    this._symbols.splice(this._symbols.indexOf(symbol), 1);

    this.onGraphChange();
  }

  renameCustomSymbol(prevSymbol, nextSymbol)
  {
    const i = this._symbols.indexOf(prevSymbol);
    if (i <= 0) throw new Error("Trying to rename unknown symbol \'" + prevSymbol + "\'");
    this._symbols[i] = nextSymbol;

    this.onGraphChange();
  }

  isCustomSymbol(symbol)
  {
    return this._symbols.includes(symbol);
  }

  toDFA(dst = null)
  {
    const result = dst || new DFA();
    if (!(result instanceof DFA))
      throw new Error("Trying to parse graph mismatched machine type.");
    const graph = this.graphController.getGraph();
    fillFSA(graph, result);
    return result;
  }

  toNFA(dst=null)
  {
    const result = dst || new NFA();
    if (!(result instanceof NFA))
      throw new Error("Trying to parse graph mismatched machine type.");
    const graph = this.graphController.getGraph();
    fillFSA(graph, result);
    return result;
  }

  getMachineErrors()
  {
    return this._errors;
  }

  getMachineWarnings()
  {
    return this._warnings;
  }

	isMachineValid()
	{
		return this._errors.length <= 0;
	}

  getMachine()
  {
    return this._machine;
  }
}

function fillFSA(graph, fsa)
{
  if (graph.getNodes().length <= 0) return fsa;
  //Create all the nodes
  for(const node of graph.getNodes())
  {
    try
    {
      let state = node.getNodeLabel();
      fsa.newState(state);

      //Set final state
      if (node.getNodeAccept())
      {
        fsa.setFinalState(state, true);
      }
    }
    catch(e)
    {
      throw e;
    }
  }

  //Create all the edges
  for(const edge of graph.getEdges())
  {
    //Ignore any incomplete edges
    if (edge.isPlaceholder()) continue;
    const from = edge.getSourceNode();
    const to = edge.getDestinationNode();
    if (from instanceof Node && to instanceof Node)
    {
      const labels = edge.getEdgeSymbolsFromLabel();
      for(const label of labels)
      {
        try
        {
          fsa.newTransition(from.getNodeLabel(), to.getNodeLabel(), label);
        }
        catch(e)
        {
          throw e;
        }
      }
    }
  }

  //Set start state
  let startState = graph.getStartNode().getNodeLabel();
  fsa.setStartState(startState);

  return fsa;
}

export default FSABuilder;
