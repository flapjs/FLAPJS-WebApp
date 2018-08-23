import FSA from './FSA.js';
import { EMPTY } from './Symbols.js';

const SRC = 0;
const SYMBOL = 1;
const DST = 2;

class NFA extends FSA
{
  constructor()
  {
    super();
  }

  //Override
  getUsedAlphabet(dst=[])
  {
    const result = dst;
    for(const transition of this._transitions)
    {
      const symbol = transition[SYMBOL];
      if (!result.includes(symbol) && symbol != EMPTY)
      {
        result.push(symbol);
      }
    }
    return result;
  }

  //Override
  doTransition(state, symbol, dst=[])
  {
    const result = dst;
    for(const transition of this._transitions)
    {
      if (transition[SRC] == state && transition[SYMBOL] == symbol)
      {
        result.push(transition[DST]);
      }
    }
    return result;
  }

  doClosureTransition(state, dst=[])
  {
    const result = dst;
    result.push(state);
    for(let i = 0; i < result.length; ++i)
    {
      const transitions = this.getOutgoingTransitions(result[i]);
      for(const transition of transitions)
      {
        if (transition[SYMBOL] == EMPTY)
        {
          const dst = transition[DST];
          if (!result.includes(dst))
          {
            result.push(dst);
          }
        }
      }
    }
    return result;
  }

  doTerminalTransition(state, symbol, dst=[])
  {
    const result = dst;
    for(const transition of this._transitions)
    {
      if (transition[SRC] == state && transition[SYMBOL] == symbol)
      {
        //Get closure on destination states
        const states = this.doClosureTransition(transition[DST]);
        for(const s of states)
        {
          if (!result.includes(s))
          {
            result.push(s);
          }
        }
      }
    }

    return result;
  }
}

export default NFA;
