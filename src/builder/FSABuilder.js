import Config from 'config.js';

import MachineBuilder from './MachineBuilder.js';
import DFAErrorChecker from './DFAErrorChecker.js';
import NFA from 'machine/NFA.js';
import NodalGraph from 'graph/NodalGraph';

const MESSAGE_NO_ERRORS = "Hooray! No more errors!";
const MESSAGE_TAG_MACHINE_ERRORS = "machineError";
const ERROR_CHECK_INTERVAL = 2000;
const GRAPH_CHANGE_IMMEDIATE_INTERVAL = 50;

class FSABuilder extends MachineBuilder
{
  constructor(graph, tester, app)
  {
    super(graph);

    this.tester = tester;
    this.app = app;

    this._machine = new NFA();
    this._machineType = "DFA";
    this._alphabet = [];
    this._symbols = [];

    this._timer = null;
    this._errorTimer = null;

    this.machineErrorChecker = new DFAErrorChecker(this, graph);

    this.onGraphChange = this.onGraphChange.bind(this);
    this.onDelayedGraphChange = this.onDelayedGraphChange.bind(this);
    this.onDelayedErrorCheck = this.onDelayedErrorCheck.bind(this);
  }

  initialize()
  {
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
  }

  onGraphChange(graph)
  {
    console.log("GRAPH CHANGE!");
    
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

    this._timer = setTimeout(this.onDelayedGraphChange, GRAPH_CHANGE_IMMEDIATE_INTERVAL);
    this._errorTimer = setTimeout(this.onDelayedErrorCheck,
      this.tester.isImmediateErrorCheck ? (GRAPH_CHANGE_IMMEDIATE_INTERVAL * 2) : ERROR_CHECK_INTERVAL);
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

    //clear previous error messages
    const notification = this.app.notification;
    notification.clearErrorMessage(MESSAGE_TAG_MACHINE_ERRORS);
    const result = this.machineErrorChecker.checkErrors((error, targets) => {
      notification.clearMessage(MESSAGE_TAG_MACHINE_ERRORS);
      let message = error + ": ";
      message += targets.join(", ");
      notification.addErrorMessage(message, MESSAGE_TAG_MACHINE_ERRORS);
    });

    //Output success if no errors were found
    if (!result)
    {
      notification.clearErrorMessage(MESSAGE_TAG_MACHINE_ERRORS);
      notification.addMessage(MESSAGE_NO_ERRORS, MESSAGE_TAG_MACHINE_ERRORS);
    }
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
    this._machineType = machineType;

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

  getAlphabet()
  {
    const machine = this.getMachine();
    this._alphabet.length = 0;
    machine.getAlphabet(this._alphabet);
    return this._alphabet;
  }

  getMachine()
  {
    return this._machine;
  }
}

export default FSABuilder;
