import PDA from 'modules/pda/machine/PDA.js'
import { EMPTY } from 'deprecated/fsa/machine/Symbols.js'


export function solvePDA(pda, input)
{
  if (typeof input === 'string') input = input[Symbol.iterator]();

  let cachedStates = [];
  let cachedSymbols = [];
  cachedStates.push({state: pda.getStartState(),stack:[],index: 0});
  for (let res of pda.doClosureTransition(pda.getStartState(),[]))
  {
    cachedStates.push({state: res[0] ,stack : res[1], index: 0});
  }
  let checkedStates = [];
  let symbol = null;
  let counter = 0;

  while(cachedStates.length > 0)
  {
    symbol = input.next().value;
    if (solvePDAbyStep(pda, symbol, cachedStates, cachedSymbols, checkedStates)==true)
    {
      return true;
    }
    //HACK: This is to stop any infinite loops! This will be fixed in the future!
    ++counter;
    if (counter > 1000)
    {
      return false;
    }
  }

  return false;
}


export function solvePDAbyStep(pda, symbol, cachedStates, cachedSymbols, checkedStates)
{
  //initialize variables
  let state = null;
  let stack = null;
  let nextStates = [];
  let nextIndex = 0;

  if (symbol != null)
  {
    cachedSymbols.push(symbol);
  }

  for(let cstate of cachedStates)
  {
    state = cstate.state;
    stack = cstate.stack;
    symbol = cstate.index < cachedSymbols.length ? cachedSymbols[cstate.index] : null;
    if (symbol != null)
    {
      //Read to next state...
      nextIndex = cstate.index + 1;
      for(let res of pda.doTerminalTransition(state, symbol,stack))
      {
        nextStates.push({state: res[0], stack:res[1], index: nextIndex});
      }
    }
    else
    {
      if (pda.isFinalState(state))
      {
        return true;
      }
      checkedStates.push(state);
    }

    //Read none to next state...
    nextIndex = cstate.index;
    /*for(let nextState of pda.doTransition(state,EMPTY))
    {
      if (checkedStates.includes(nextState)) continue;
      if (symbol == null && pda.isFinalState(nextState)) return true;

      nextStates.push({state: nextState, index: nextIndex});
    }*/
  }
  cachedStates.length = 0
  cachedStates.push(...nextStates);
  return false;
}
