
const SRC = 0;
const SYMBOL = 1;
const DST = 2;
const POP_SYMBOL = 3;
const PUSH_SYMBOL = 4;

import { EMPTY } from 'deprecated/fsa/machine/Symbols.js';

class PDA
{
  constructor()
  {
    this._states = [];
    this._transitions = [];
    this._finalStates = [];

    this._customAlphabet = [];
    this._customStackAlphabet = [];
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

  newTransition(fromState,  symbol, toState,popSymbol, pushSymbol)
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
    this._transitions.push([fromState, symbol, toState, popSymbol, pushSymbol]);
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

  newStackSymbol(symbol)
  {
    if (this._customStackAlphabet.includes(symbol))
    {
      throw new Error("Symbol \'" + symbol + "\' already added to stack alphabet.");
    }

    this._customStackAlphabet.push(symbol);
  }

  deleteStackSymbol(symbol)
  {
    if (!this._customStackAlphabet.includes(symbol))
    {
      throw new Error("Unable to remove symbol \'" + symbol + "\' from stack alphabet.");
    }

    this._customStackAlphabet.splice(this._customStackAlphabet.indexOf(symbol), 1);
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

  //do all transitions with current state and given input
  doTransition(state, symbol, stack = [])
  {
    const result = [];
    for(const transition of this._transitions)
    {
      if (transition[SRC] == state && transition[SYMBOL] == symbol && (transition[POP_SYMBOL] == stack[stack.length-1] || transition[POP_SYMBOL] == EMPTY))
      {
        var newStack = stack.slice();
        if(transition[POP_SYMBOL] != EMPTY)
        {
          newStack.pop()
        }
        if (transition[PUSH_SYMBOL] != EMPTY)
        {
          newStack.push(transition[PUSH_SYMBOL])
        }
        result.push[transition[DST],newStack];
      }
    }
    return result;
  }

  //get all reachable state from current state without any input
  doClosureTransition(state,stack,dst=[])
  {
    const result = dst;
    result.push([state,stack]);
    for(let i = 0; i < result.length; ++i)
    {
      const transitions = this.getOutgoingTransitions(result[i][0]);
      for(const transition of transitions)
      {
        if (transition[SYMBOL] == EMPTY && (transition[POP_SYMBOL] == result[i][1][result[i][1].length-1] || transition[POP_SYMBOL] == EMPTY))
        {
          var newStack = result[i][1].slice();
          if(transition[POP_SYMBOL] != EMPTY)
          {
            newStack.pop()
          }
          if (transition[PUSH_SYMBOL] != EMPTY)
          {
            newStack.push(transition[PUSH_SYMBOL]);
          }
          const dst = transition[DST];
          if (!result.includes([dst,newStack]))
          {
            result.push([dst,newStack]);
          }
        }
      }
    }
    return result;
  }

  //get all state from current state and read a symbol
  doTerminalTransition(state, symbol, stack, dst=[])
  {
    const result = dst;
    for(const transition of this._transitions)
    {
      if (transition[SRC] == state && transition[SYMBOL] == symbol && (transition[POP_SYMBOL] == stack[stack.length-1] || transition[POP_SYMBOL] == EMPTY))
      {
        var newStack = stack.slice();
        if(transition[POP_SYMBOL] != EMPTY)
        {
          newStack.pop()
        }
        if (transition[PUSH_SYMBOL] != EMPTY)
        {
          newStack.push(transition[PUSH_SYMBOL]);
        }
        //Get closure on destination states
        const res = this.doClosureTransition(transition[DST],newStack);
        for(const r of res)
        {
          if (!result.includes(r))
          {
            result.push(r);
          }
        }
      }
    }
    return result;
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
      {
        result.push(transition);
      }
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
    result.type = "PDA";
    /*
    result.states = this._states.slice();
    result.alphabet = this._customAlphabet.slice();
    result.usedAlphabet = this.getUsedAlphabet();
    result.transitions = this._transitions.slice();
    result.startState = this.getStartState();
    result.finalStates = this._finalStates.slice();
    */

    return result;
  }
}

export default PDA;
