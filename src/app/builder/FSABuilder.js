import Config from 'config.js';

import MachineBuilder from './MachineBuilder.js';
import DFAErrorChecker from './DFAErrorChecker.js';
import NFAErrorChecker from './NFAErrorChecker.js';
import DFA from 'machine/DFA.js';
import NFA from 'machine/NFA.js';
import NodalGraph from 'graph/NodalGraph';

import { EMPTY } from 'machine/Symbols.js';

class FSABuilder extends MachineBuilder
{
  constructor(graph, controller)
  {
    super(graph, controller);

    this._machine = new NFA();
    this._machineType = "DFA";
    this._alphabet = [];
    this._symbols = [];

    this._timer = null;
    this._errorTimer = null;

    this.machineErrorChecker = new DFAErrorChecker(this, graph);
    this.tester = null;
    this.notification = null;

    this.onGraphChange = this.onGraphChange.bind(this);
    this.onDelayedGraphChange = this.onDelayedGraphChange.bind(this);
    this.onDelayedErrorCheck = this.onDelayedErrorCheck.bind(this);
  }

  initialize(app)
  {
    super.initialize(app);

    this.tester = app.testingManager;
    this.notification = app.notification;

    this.graph.on("nodeCreate", this.onGraphChange);
    this.graph.on("nodeDestroy", this.onGraphChange);
    this.graph.on("nodeLabel", this.onGraphChange);
    this.graph.on("edgeCreate", this.onGraphChange);
    this.graph.on("edgeDestroy", this.onGraphChange);
    this.graph.on("edgeLabel", this.onGraphChange);
    this.graph.on("edgeDestination", this.onGraphChange);
    this.graph.on("toggleAccept", this.onGraphChange);
    this.graph.on("newInitial", this.onGraphChange);

    this.onGraphChange();
  }

  destroy()
  {
    this.onGraphChange();

    this.graph.removeEventListener("nodeCreate", this.onGraphChange);
    this.graph.removeEventListener("nodeDestroy", this.onGraphChange);
    this.graph.removeEventListener("nodeLabel", this.onGraphChange);
    this.graph.removeEventListener("edgeCreate", this.onGraphChange);
    this.graph.removeEventListener("edgeDestroy", this.onGraphChange);
    this.graph.removeEventListener("edgeLabel", this.onGraphChange);
    this.graph.removeEventListener("edgeDestination", this.onGraphChange);
    this.graph.removeEventListener("toggleAccept", this.onGraphChange);
    this.graph.removeEventListener("newInitial", this.onGraphChange);

    super.destroy();
  }

  onGraphChange(graph)
  {
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
    const result = this.graph._toNFA(this._machine);
    for(const s of this._symbols)
    {
      this._machine.newSymbol(s);
    }
  }

  onDelayedErrorCheck()
  {
    if (!this.tester.shouldCheckError) return;

    this.machineErrorChecker.checkErrors(this.notification);
  }

  formatAlphabetString(string)
  {
    const symbols = string.split(",");
    const result = new Set();

    let symbol = "";
    let symbolLength = 0;
    const length = symbols.length;
    for(let i = 0; i < length; ++i)
    {
      symbol = symbols[i].trim();
      symbolLength = symbol.length;
      //If the symbol has none or more than 1 char
      if (symbolLength !== 1)
      {
        //Remove symbol (by not adding to result)

        //Divide multi-char symbol into smaller single char symbols
        if (symbolLength > 1)
        {
          for(let subsymbol of symbol.split(""))
          {
            subsymbol = subsymbol.trim();
            if (!result.has(subsymbol))
            {
              result.add(subsymbol);
            }
          }
        }
      }
      else
      {
        result.add(symbol);
      }
    }

    //If it is an empty string...
    if (result.size === 0) return EMPTY;
    return Array.from(result).join(",");
  }

  setMachineType(machineType)
  {
    if (this._machineType == machineType) return;

    this._machineType = machineType;
    if (machineType == "DFA")
    {
      this.machineErrorChecker = new DFAErrorChecker(this, this.graph);
    }
    else if (machineType == "NFA")
    {
      this.machineErrorChecker = new NFAErrorChecker(this, this.graph);
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

  addSymbol(symbol)
  {
    this._symbols.push(symbol);

    this.onGraphChange();
  }

  removeSymbol(symbol)
  {
    this._symbols.splice(this._symbols.indexOf(symbol), 1);

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

  toDFA()
  {
    const result = new DFA();
    fillFSA(this.graph, result);
    return result;
  }

  getMachine()
  {
    return this._machine;
  }
}

function fillFSA(graph, fsa)
{
  if (graph.nodes.length <= 0) return fsa;
  //Create all the nodes
  for(const node of graph.nodes)
  {
    try
    {
      let state = node.label;
      fsa.newState(state);

      //Set final state
      if (node.accept)
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
  for(const edge of graph.edges)
  {
    //Ignore any incomplete edges
    if (edge.isPlaceholder()) continue;
    const from = edge.from;
    const to = edge.to;
    if (from instanceof Node && to instanceof Node)
    {
      const labels = edge.label.split(",");
      for(const label of labels)
      {
        try
        {
          fsa.newTransition(from.label, to.label, label);
        }
        catch(e)
        {
          throw e;
        }
      }
    }
  }

  //Set start state
  let startState = graph.getStartNode().label;
  fsa.setStartState(startState);

  return fsa;
}

export default FSABuilder;
