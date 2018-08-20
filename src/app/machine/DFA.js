import FSA from './FSA.js';

const SRC = 0;
const SYMBOL = 1;
const DST = 2;

class DFA extends FSA
{
  constructor()
  {
    super();
  }

  validate()
  {
    const alphabet = this.getAlphabet();
    const foundSymbols = new Array(alphabet.length);
    foundSymbols.fill(false);

    for(const state of this._states)
    {
      //Get all outgoing transitions
      const transitions = this.getOutgoingTransitions(state);
      for(const transition of transitions)
      {
        const index = alphabet.indexOf(transition[1]);
        if (foundSymbols[index] == false)
        {
          foundSymbols[index] = true;
        }
        else
        {
          //Found duplicate
          return false;
        }
      }

      //Reset foundSymbols for next state
      const length = foundSymbols.length;
      for(let i = 0; i < length; ++i)
      {
        if (foundSymbols[i] == false)
        {
          //Found missing symbol for state
          return false;
        }
        foundSymbols[i] = false;
      }
    }

    return true;
  }

  //Override default behavior
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

    for(const transition of this._transitions)
    {
      //Check if already exists...
      if (transition[SRC] == fromState && transition[SYMBOL] == symbol && transition[DST] == toState)
      {
        return;
      }
      //Check if valid deterministic transition...
      else if (transition[SRC] == fromState && transition[SYMBOL] == symbol)
      {
        throw new Error("Unable to create illegal nondeterministic transition for DFA.");
      }
    }

    //Create new transition
    this._transitions.push([fromState, symbol, toState]);
  }
}

export default DFA;
