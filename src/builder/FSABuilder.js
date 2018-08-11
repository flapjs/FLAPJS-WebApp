import Config from 'config.js';

import MachineBuilder from './MachineBuilder.js';
import DFAErrorChecker from './DFAErrorChecker.js';
import NFA from 'machine/NFA.js';
import NodalGraph from 'graph/NodalGraph';

const MESSAGE_NO_ERRORS = "Hooray! No more errors!";
const MESSAGE_TAG_MACHINE_ERRORS = "machineError";
const ERROR_CHECK_INTERVAL = 2000;

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

    this.machineErrorChecker = new DFAErrorChecker(this, graph);
  }

  onGraphChange(graph)
  {
    if (this._timer)
    {
      clearTimeout(this._timer);
      this._timer = null;
    }

    const doErrorCheck = () => {
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
    };

    if (!this.tester.isImmediateErrorCheck)
    {
      this._timer = setTimeout(doErrorCheck, ERROR_CHECK_INTERVAL);
    }
    else
    {
      doErrorCheck();
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
  }

  getMachineType()
  {
    return this._machineType;
  }

  addSymbol(symbol)
  {
    this._symbols.push(symbol);
  }

  removeSymbol(symbol)
  {
    this._symbols.splice(this._symbols.indexOf(symbol), 1);
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
    this._machine.clear();
    const result = this.graph._toNFA(this._machine);
    for(const s of this._symbols)
    {
      this._machine.newSymbol(s);
    }
    return result;
  }
}

export default FSABuilder;
