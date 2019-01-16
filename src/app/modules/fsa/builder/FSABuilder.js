import Config from 'config.js';

import MachineBuilder from './MachineBuilder.js';
import DFAErrorChecker from './DFAErrorChecker.js';
import NFAErrorChecker from './NFAErrorChecker.js';
import DFA from 'machine/DFA.js';
import NFA from 'machine/NFA.js';
import Node from 'modules/fsa/graph/FSANode.js';

class FSABuilder extends MachineBuilder
{
  constructor()
  {
    super();

    this._machine = new NFA();
    this._machineType = "DFA";
    this._machineValidDFA = false;
    this._alphabet = [];
    this._symbols = [];

    this._savedGraphHash = 0;

    this._timer = null;
    this._errorTimer = null;

    this.machineErrorChecker = null;
    this.tester = null;

    this.graphController = null;
    this.machineController = null;

    this.onGraphChange = this.onGraphChange.bind(this);
    this.onDelayedGraphChange = this.onDelayedGraphChange.bind(this);
    this.onDelayedErrorCheck = this.onDelayedErrorCheck.bind(this);
  }

  initialize(module)
  {
    super.initialize(module);

    this.tester = module.getTestingManager();
    this.graphController = module.getGraphController();
    this.machineController = module.getMachineController();

    const graph = this.graphController.getGraph();
    this.machineErrorChecker = new DFAErrorChecker(this, graph);

    this._savedGraphHash = graph.getHashCode(false);
    this.onGraphChange();
  }

  destroy()
  {
    const graph = this.graphController.getGraph();
    this._savedGraphHash = graph.getHashCode(false);
    this.onGraphChange();

    super.destroy();
  }

  update()
  {
    const graph = this.graphController.getGraph();
    const graphHash = graph.getHashCode(false);
    if (graphHash !== this._savedGraphHash)
    {
      this._savedGraphHash = graphHash;
      this.onGraphChange(graph);
    }
  }

  onGraphChange(graph)
  {
    if (!this.tester) return;

    if (this._timer)
    {
      clearTimeout(this._timer);
      this._timer = null;
    }

    if (this._errorTimer)
    {
      clearTimeout(this._errorTimer);
      this._errorTimer = null;
    }

    this._timer = setTimeout(this.onDelayedGraphChange, Config.GRAPH_IMMEDIATE_INTERVAL);
    this._errorTimer = setTimeout(this.onDelayedErrorCheck,
      this.tester.isImmediateErrorCheck ? (Config.GRAPH_IMMEDIATE_INTERVAL * 2) : Config.ERROR_CHECK_INTERVAL);
  }

  onDelayedGraphChange()
  {
    this._machine.clear();
    const result = this.toNFA(this._machine);
    for(const s of this._symbols)
    {
      this._machine.newSymbol(s);
    }
    this._machineValidDFA = this._machine.isValidDFA();
  }

  onDelayedErrorCheck()
  {
    if (!this.tester.shouldCheckError) return;

    this.machineErrorChecker.checkErrors(true, this.graphController, this.machineController);
  }

  setMachineType(machineType)
  {
    if (this._machineType == machineType) return;

    this._machineType = machineType;
    if (machineType == "DFA")
    {
      const graph = this.graphController.getGraph();
      this.machineErrorChecker = new DFAErrorChecker(this, graph);
    }
    else if (machineType == "NFA")
    {
      const graph = this.graphController.getGraph();
      this.machineErrorChecker = new NFAErrorChecker(this, graph);
    }
    else
    {
      throw new Error("Cannot find error checker for machine type \'" + machineType + "\'");
    }

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

  getAlphabet()
  {
    const machine = this.getMachine();
    this._alphabet.length = 0;
    machine.getAlphabet(this._alphabet);
    return this._alphabet;
  }

  isValidMachine()
  {
    if (this._machineType == "DFA")
    {
      return this._machineValidDFA;
    }
    else
    {
      return true;
    }
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
