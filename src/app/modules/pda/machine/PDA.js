import GraphElement from 'graph/GraphElement.js';
import { guid, stringHash } from 'util/MathHelper.js';

const FROM_STATE_INDEX = 0;
const READ_SYMBOL_INDEX = 1;
const TO_STATE_INDEX = 2;
const POP_SYMBOL_INDEX = 3;
const PUSH_SYMBOL_INDEX = 4;

export const EMPTY_SYMBOL = '&empty';

export class State
{
  constructor(label="", src=null)
  {
    this._label = label;

    this._src = src;
    this._id = src instanceof GraphElement ? src.getGraphElementID() : guid();
  }

  copy()
  {
    const result = new State();
    result._label = this._label;
    result._src = this._src;
    result._id = this._id;
    return result;
  }

  getStateLabel() { return this._label; }

  getStateID() { return this._id; }
  getSource() { return this._src; }

  getHashString()
  {
    return this._id;
  }
}

export class Transition
{
  constructor(from, to)
  {
    this._from = from;
    this._to = to;
    this._symbols = new Map();
  }

  copy()
  {
    const result = new Transition();
    result._from = this._from;
    result._to = this._to;

    throw new Error("Not yet implemented");
    result._symbols = this._symbols.slice();

    return result;
  }

  getSourceState() { return this._from; }
  getDestinationState() { return this._to; }

  addSymbol(read, pop, push)
  {
    const symbol = new Symbol(read, pop, push);
    this._symbols.set(symbol.getHashString(), symbol);
  }

  hasSymbol(read, pop=null, push=null)
  {
    for(const symbol of this._symbols.values())
    {
      if (symbol.getReadSymbol() === read)
      {
        if (!pop || symbol.getPopSymbol() === pop)
        {
          if (!push || symbol.getPushSymbol() === push)
          {
            return true;
          }
        }
      }
    }
    return false;
  }

  getSymbols() { return this._symbols.values(); }

  getHashString()
  {
    let symbolString = "";
    for(const symbol of this._symbols.values())
    {
      symbolString += symbol.getHashString() + ",";
    }
    return this._from.getHashString() + ":" + symbolString + ":" + this._to.getHashString();
  }
}

export class Symbol
{
  constructor(read, pop, push)
  {
    this._read = read;
    this._pop = pop;
    this._push = push;
  }

  getReadSymbol() { return this._read; }
  getPopSymbol() { return this._pop; }
  getPushSymbol() { return this._push; }

  getHashString()
  {
    return this._read + ";" + this._pop + ";" + this._push;
  }
}

class PDA
{
  constructor()
  {
    //state id -> state
    this._states = new Map();
    //symbol -> symbol use counter
    this._alphabet = new Map();
    //transition key (from + to) -> transition object
    this._transitions = new Map();
    this._finalStates = new Set();
    this._customSymbols = new Set();
    this._startState = null;

    this._errors = [];
  }

  /**
   * Performs a shallow copy of the 2 machines. Any changes to a state will be
   * reflected in both. However, changes to transitions, alphabet, and final
   * states will not propagate.
   */
  copy(fsa)
  {
    //You are already yourself, don't copy nothing.
    if (fsa === this) return;

    //Make room for the copy...
    this.clear();

    //Copy state
    for(const [key, value] of fsa._states.entries())
    {
      const result = value.copy();
      this._states.set(key, result);

      //Copy start state
      if (fsa.isStartState(value))
      {
        this._startState = result;
      }
      //Copy final states
      if (fsa.isFinalState(value))
      {
        this._finalStates.add(result);
      }
    }
    //Copy alphabet
    for(const [key, value] of fsa._alphabet.entries())
    {
      this._alphabet.set(key, value);
    }
    //Copy transitions
    for(const [key, value] of fsa._transitions.entries())
    {
      const result = value.copy();
      result._from = this._states.get(value.getSourceState().getStateID());
      result._to = this._states.get(value.getDestinationState().getStateID());
      this._transitions.set(key, result);
    }
    //Copy custom symbols
    for(const symbol of fsa._customSymbols)
    {
      this._customSymbols.add(symbol);
    }

    //Copy errors
    for(const error of fsa._errors)
    {
    //WARNING: if the error's store state objects, they need to be redirected to the copies
      this._errors.push(error);
    }
  }

  clear()
  {
    this._states.clear();
    this._alphabet.clear();
    this._transitions.clear();
    this._finalStates.clear();
    this._customSymbols.clear();
    this._startState = null;

    this._errors.length = 0;
  }

  validate()
  {
    //Reset errors
    this._errors.length = 0;
    return true;
  }
  isValid() { return this._errors.length == 0; }
  getErrors() { return this._errors; }

  createState(label="")
  {
    return this.addState(new State(label));
  }

  addState(state)
  {
    const stateID = state.getStateID();
    if (this._states.has(stateID)) throw new Error("Already added state with id \'" + stateID + "\'");
    //Make state as new start state if no other states exist...
    if (this._states.size <= 0) this._startState = state;
    //Add to state set
    this._states.set(stateID, state);
    return state;
  }

  removeState(state)
  {
    const stateID = state.getStateID();
    if (!this._states.has(stateID)) return false;
    this._states.delete(stateID);

    //Deleted the start state, so must pick another one...
    if (this._startState === state)
    {
      if (this._states.size <= 0)
      {
        //If no more states to choose from, don't choose anything
        this._startState = null;
      }
      else
      {
        //Choose an arbitrary start state
        this._startState = this._states.values().next().value;
      }
    }

    return true;
  }

  hasStateWithLabel(label)
  {
    for(const state of this._states.values())
    {
      if (state.getStateLabel() == label)
      {
        return true;
      }
    }
    return false;
  }

  getStatesByLabel(label, dst=[])
  {
    for(const state of this._states.values())
    {
      if (state.getStateLabel() == label)
      {
        dst.push(state);
      }
    }
    return dst;
  }

  getStateByID(id)
  {
    return this._states.get(id);
  }

  hasState(state) { return this._states.has(state.getStateID()); }

  getStates() { return this._states.values(); }

  getStateCount() { return this._states.size; }

  addTransition(from, to, symbol)
  {
    if (!this.hasState(from)) throw new Error("Trying to add a transition to unknown state with label \'" + state.getStateLabel() + "\'");
    if (!this.hasState(to)) throw new Error("Trying to add a transition to unknown state with label \'" + state.getStateLabel() + "\'");
    if (!symbol) throw new Error("Cannot add transition for null symbol - use the empty symbol instead");

    const transitionKey = from.getStateID() + "->" + to.getStateID();
    if (this._transitions.has(transitionKey))
    {
      const transition = this._transitions.get(transitionKey);
      if (!transition.hasSymbol(symbol))
      {
        transition.addSymbol(symbol);
      }
      else
      {
        //Didn't add anything...
        return false;
      }
    }
    else
    {
      this._transitions.set(transitionKey, new Transition(from, to, [symbol]));
    }

    //Add to alphabet...
    this._incrSymbolCount(symbol);
    return true;
  }

  removeTransition(from, to, symbol=null)
  {
    const transitionKey = from.getStateID() + "->" + to.getStateID();
    if (!this._transitions.has(transitionKey)) return false;

    const transition = this._transitions.get(transitionKey);
    const symbols = transition.getSymbols();

    //If deleting a specific symbol...
    if (symbol)
    {
      const index = symbols.indexOf(symbol);
      if (index >= 0)
      {
        //Update symbol counts...
        this._decrSymbolCount(symbol);

        symbols.splice(index, 1);
        if (symbols.length <= 0) this._transitions.delete(transitionKey);
        return true;
      }
      else
      {
        return false;
      }
    }
    //If deleting a all associated symbols...
    else
    {
      //Update symbol counts...
      for(const symbol of symbols)
      {
        this._decrSymbolCount(symbol);
      }

      //Remove transition
      this._transitions.delete(transitionKey);
      return true;
    }
  }

  hasTransition(from, to, symbol=null)
  {
    const transitionKey = from.getStateID() + "->" + to.getStateID();
    if (!this._transitions.has(transitionKey)) return false;
    //Not checking for specific symbols...
    if (!symbol) return true;

    //Find the symbol...
    return this._transitions.get(transitionKey).hasSymbol(symbol);
  }

  getTransitionSymbols(from, to)
  {
    const transitionKey = from.getStateID() + "->" + to.getStateID();
    if (!this._transitions.has(transitionKey)) return null;
    return this._transitions.get(transitionKey).getSymbols();
  }

  getTransitions() { return this._transitions.values(); }

  _incrSymbolCount(symbol)
  {
    //Don't add empty symbol to the alphabet
    if (symbol === EMPTY_SYMBOL) return;

    const symbolCount = this._alphabet.get(symbol) || 0;
    this._alphabet.set(symbol, symbolCount + 1);
  }

  _decrSymbolCount(symbol)
  {
    if (!this._alphabet.has(symbol)) throw new Error("Unable to find valid transition symbol in alphabet");

    //Empty symbol is not in the alphabet
    if (symbol === EMPTY_SYMBOL) return;

    const symbolCount = this._alphabet.get(symbol);
    //Delete the symbol, since it is no longer used...
    if (symbolCount <= 1)
    {
      if (!this.isCustomSymbol(symbol))
      {
        //Regular symbols are removed if unused...
        this._alphabet.delete(symbol);
      }
      else
      {
        //Custom symbols stay in the alphabet, even if unused...
        this._alphabet.set(symbol, 0);
      }
    }
    else
    {
      //Still being used by someone...
      this._alphabet.set(symbol, symbolCount - 1);
    }
  }

  changeSymbol(symbol, newSymbol)
  {
    if (symbol === EMPTY_SYMBOL) throw new Error("Cannot change the empty symbol");
    if (newSymbol === EMPTY_SYMBOL) throw new Error("Cannot change to the empty symbol");
    if (this._alphabet.has(newSymbol)) throw new Error("Cannot change symbol to another existing symbol");

    for(const transition of this._transitions.values())
    {
      const symbols = transition.getSymbols();
      const index = symbols.indexOf(symbol);

      //Change the symbol from the transition
      if (index >= 0)
      {
        symbols[index] = newSymbol;
      }
    }

    //Exchange symbol counts...
    const count = this._alphabet.get(symbol);
    this._alphabet.set(newSymbol, count);
    this._alphabet.delete(symbol);

    //Check if custom symbol...
    if (this._customSymbols.has(symbol))
    {
      this._customSymbols.delete(symbol);
      this._customSymbols.add(newSymbol);
    }
  }

  removeSymbol(symbol)
  {
    const cache = [];
    for(const [key, transition] of this._transitions.entries())
    {
      const symbols = transition.getSymbols();
      const index = symbols.indexOf(symbol);

      //Delete the symbol from the transition
      if (index >= 0)
      {
        symbols.splice(index, 1);

        //If no more symbols, make sure to delete it from the map later...
        if (symbols.length <= 0)
        {
          cache.push(key);
        }
      }
    }

    //Delete any transitions that have no more symbols...
    for(const transitionKey of cache)
    {
      this._transitions.delete(transitionKey);
    }

    //Remove from alphabet if possible...
    if (symbol !== EMPTY_SYMBOL)
    {
      if (this._customSymbols.has(symbol))
      {
        this._alphabet.set(symbol, 0);
      }
      else
      {
        this._alphabet.delete(symbol);
      }
    }
  }

  setCustomSymbol(symbol, custom=true)
  {
    if (symbol === EMPTY_SYMBOL) throw new Error("Cannot change the empty symbol as a custom symbol");

    if (custom)
    {
      if (!this._customSymbols.has(symbol))
      {
        this._customSymbols.add(symbol);

        //Add symbol to alphabet if missing...
        if (!this._alphabet.has(symbol)) this._alphabet.set(symbol, 0);
      }
    }
    else
    {
      if (this._customSymbols.has(symbol))
      {
        this._customSymbols.delete(symbol);

        //If symbol is unused, delete it
        if (this._alphabet.has(symbol) && this._alphabet.get(symbol) <= 0) this._alphabet.delete(symbol)
      }
    }
  }

  isCustomSymbol(symbol)
  {
    return this._customSymbols.has(symbol);
  }

  getCustomSymbols()
  {
    return this._customSymbols;
  }

  clearCustomSymbols()
  {
    this._customSymbols.clear();
  }

  isUsedSymbol(symbol)
  {
    return this._alphabet.has(symbol) && this._alphabet.get(symbol) > 0;
  }

  isSymbol(symbol)
  {
    return this._alphabet.has(symbol);
  }

  getAlphabet()
  {
    return this._alphabet.keys();
  }

  setStartState(state)
  {
    const stateID = state.getStateID();
    if (!this._states.has(stateID))
    {
      //Add it to the state set
      this._states.set(stateID, state);
    }
    this._startState = state;
  }
  isStartState(state) { return this._startState === state; }
  getStartState() { return this._startState; }

  setFinalState(state, final=true)
  {
    //Make final
    if (final)
    {
      //If missing from state set, add it in...
      if (!this._states.has(state.getStateID()))
      {
        this.addState(state);
      }

      this._finalStates.add(state);
    }
    else
    {
      //If missing from state set, it would be effectively the same thing as
      //calling addState(state). So due to ambiguity, don't do it.
      if (!this._states.has(state.getStateID())) throw new Error("Trying to change final for missing state \'" + state.getStateLabel() + "\'");

      this._finalStates.delete(state);
    }
  }
  isFinalState(state) { return this._finalStates.has(state); }
  getFinalStates() { return this._finalStates; }

  doTransition(state, symbol, dst=[])
  {
    if (!state) return dst;
    if (!(state instanceof State)) throw new Error("Invalid state instance type \'" + (typeof state) + "\'");
    if (!this._states.has(state.getStateID())) throw new Error("Unable to find source state with id \'" + state.getStateID() + "\'");

    if (!symbol) symbol = EMPTY_SYMBOL;

    const fromTransitionKey = state.getStateID() + "->";
    for(const key of this._transitions.keys())
    {
      if (key.startsWith(fromTransitionKey))
      {
        const transition = this._transitions.get(key);
        if (transition.hasSymbol(symbol))
        {
          dst.push(transition.getDestinationState());
        }
      }
    }
    return dst;
  }

  doTerminalTransition(state, symbol, dst=[])
  {
    if (!state) return dst;
    if (!this._states.has(state.getStateID())) throw new Error("Unable to find source state with id \'" + state.getStateID() + "\'");

    if (!symbol) symbol = EMPTY_SYMBOL;

    const fromTransitionKey = state.getStateID() + "->";
    for(const key of this._transitions.keys())
    {
      if (key.startsWith(fromTransitionKey))
      {
        const transition = this._transitions.get(key);
        if (transition.hasSymbol(symbol))
        {
          const toState = transition.getDestinationState();
          const result = this.doClosureTransition(toState);
          for(const s of result)
          {
            if (!dst.includes(s)) dst.push(s);
          }
        }
      }
    }

    return dst;
  }

  doClosureTransition(state, dst=[])
  {
    if (!state) return dst;

    dst.push(state);
    for(let i = 0; i < dst.length; ++i)
    {
      const transitions = this.getOutgoingTransitions(dst[i]);
      for(const transition of transitions)
      {
        if (transition[SYMBOL_INDEX] === EMPTY_SYMBOL)
        {
          const toState = transition[TO_STATE_INDEX];
          if (!dst.includes(toState))
          {
            dst.push(toState);
          }
        }
      }
    }
    return dst;
  }

  getOutgoingTransitions(state, dst=[])
  {
    if (!state) return dst;
    if (!this._states.has(state.getStateID())) throw new Error("Unable to find source state with id \'" + state.getStateID() + "\'");

    const fromTransitionKey = state.getStateID() + "->";
    for(const key of this._transitions.keys())
    {
      if (key.startsWith(fromTransitionKey))
      {
        const transition = this._transitions.get(key);
        const symbols = transition.getSymbols();
        for(const symbol of symbols)
        {
          dst.push([state, symbol, transition.getDestinationState()]);
        }
      }
    }

    return dst;
  }

  getHashCode()
  {
    let string = "";
    for(const state of this._states.values())
    {
      string += state.getHashString() + ",";
    }
    string += "|";
    for(const transition of this._transitions.values())
    {
      string += transition.getHashString() + ",";
    }
    string += "|";
    for(const state of this._finalStates)
    {
      string += state.getHashString();
    }
    string += "|";
    string += this._startState ? this._startState.getHashString() : "";
    return stringHash(string);
  }
}

export default PDA;
