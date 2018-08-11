const SRC = 0;
const SYMBOL = 1;
const DST = 2;

class FSA
{
  constructor()
  {
    this._states = [];
    this._transitions = [];
    this._finalStates = [];

    this._customAlphabet = [];
  }

  clear()
  {
    this._states.length = 0;
    this._transitions.length = 0;
    this._finalStates.length = 0;
    
    this._customAlphabet.length = 0;
  }

  newState(state)
  {
    if (this._states.includes(state))
    {
      throw new Error("State \'" + state + "\' already added to states.");
    }

    this._states.push(state);
    return state;
  }

  deleteState(state)
  {
    if (!this._states.includes(state))
    {
      throw new Error("State \'" + state + "\' does not exist.");
    }

    this._states.splice(this._states.indexOf(state), 1);
  }

  newTransition(fromState, toState, symbol)
  {
    if (!this._states.includes(fromState))
    {
      throw new Error("State \'" + fromState + "\' does not exist.");
    }

    if (!this._states.includes(toState))
    {
      throw new Error("State \'" + toState + "\' does not exist.");
    }

    //Check if already exists...
    for(const transition of this._transitions)
    {
      if (transition[SRC] == fromState && transition[SYMBOL] == symbol && transition[DST] == toState)
      {
        return;
      }
    }

    //Create new transition
    this._transitions.push([fromState, symbol, toState]);
  }

  deleteTransition(fromState, toState, symbol=null)
  {
    for(let i = this._transitions.length - 1; i >= 0; --i)
    {
      const transition = this._transitions[i];
      if (transition[SRC] == fromState && transition[DST] == toState)
      {
        //Delete if src, dst, and symbols match... or if deleting all symbols
        if (symbol == null || transition[SYMBOL] == symbol)
        {
          this._transitions.splice(i, 1);
        }
      }
    }
  }

  newSymbol(symbol)
  {
    if (this._customAlphabet.includes(symbol))
    {
      throw new Error("Symbol \'" + symbol + "\' already added to alphabet.");
    }

    this._customAlphabet.push(symbol);
  }

  deleteSymbol(symbol)
  {
    if (!this._customAlphabet.includes(symbol))
    {
      throw new Error("Unable to remove symbol \'" + symbol + "\'.");
    }

    this._customAlphabet.splice(this._customAlphabet.indexOf(symbol), 1);
  }

  setStartState(state)
  {
    if (this._states.length <= 0)
    {
      throw new Error("Not enough states.");
    }

    if (!this._states.includes(state))
    {
      throw new Error("State \'" + state + "\' does not exist.");
    }

    if (this.getStartState() == state) return;

    this._states.splice(this._states.indexOf(state), 1);
    this._states.unshift(state);
  }

  setFinalState(state, isFinal=true)
  {
    if (!this._states.includes(state))
    {
      throw new Error("State \'" + state + "\' does not exist.");
    }

    if (isFinal)
    {
      if (this._finalStates.includes(state)) return;

      this._finalStates.push(state);
    }
    else
    {
      if (!this._finalStates.includes(state)) return;
      this._finalStates.splice(this._finalStates.indexOf(state), 1);
    }
  }

  doTransition(state, symbol)
  {
    for(const transition of this._transitions)
    {
      if (transition[SRC] == state && transition[SYMBOL] == symbol)
      {
        return transition[DST];
      }
    }
    return null;
  }

  isFinalState(state)
  {
    return this._finalStates.includes(state);
  }

  hasState(state)
  {
    return this._states.includes(state);
  }

  getStates()
  {
    return this._states;
  }

  //Is the same as isAlphabet if the user did not add custom symbols
  isUsedAlphabet(symbol)
  {
    for(const transition of this._transitions)
    {
      if (transition[SYMBOL] == symbol)
      {
        return true;
      }
    }
    return false;
  }

  //Includes custom user-defined symbols (from newSymbol)
  isAlphabet(symbol)
  {
    for(const s of this._customAlphabet)
    {
      if (s == symbol) return true;
    }

    return this.isUsedAlphabet(symbol);
  }

  getUsedAlphabet(dst=[])
  {
    const result = dst;
    for(const transition of this._transitions)
    {
      const symbol = transition[SYMBOL];
      if (!result.includes(symbol))
      {
        result.push(symbol);
      }
    }
    return result;
  }

  getAlphabet(dst=[])
  {
    const result = dst;
    for(const s of this._customAlphabet)
    {
      result.push(s);
    }
    return this.getUsedAlphabet(result);
  }

  getOutgoingTransitions(state=null, dst=[])
  {
    const result = dst;
    for(const transition of this._transitions)
    {
      if (transition[SRC] == state)
      result.push(transition);
    }
    return result;
  }

  getTransitions()
  {
    return this._transitions;
  }

  getStartState()
  {
    return this._states.length <= 0 ? null : this._states[0];
  }

  getFinalStates()
  {
    return this._finalStates;
  }

  toJSON()
  {
    const result = {};
    result._version = "1.0.0";

    if (this instanceof DFA) result.type = "DFA";
    else if (this instanceof NFA) result.type = "NFA";
    else result.type = "FSA";
    result.states = this._states.slice();
    result.alphabet = this._customAlphabet.slice();
    result.usedAlphabet = this.getUsedAlphabet();
    result.transitions = this._transitions.slice();
    result.startState = this.getStartState();
    result.finalStates = this._finalStates.slice();

    return result;
  }
}

export default FSA;
