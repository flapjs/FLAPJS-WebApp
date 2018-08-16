import { EMPTY } from 'machine/Symbols.js';
import NFA from 'machine/NFA.js'

//This ASSUMES that the passed-in machine is an NFA! (and not a DFA)
export function solveNFA(nfa, input)
{
  if (typeof input === 'string') input = input[Symbol.iterator]();

  let cachedStates = [];
  let cachedSymbols = [];
  cachedStates.push({state: nfa.getStartState(), index: 0});
  let checkedStates = [];
  let symbol = null;

  while(cachedStates.length > 0)
  {
    symbol = input.next().value;
    let res = solveNFAbyStep(nfa, symbol, cachedStates, cachedSymbols, checkedStates);
    if (res) return true;
  }

  return false;
}

export function solveNFAbyStep(nfa, symbol, cachedStates,cachedSymbols,checkedStates)
{
  //initialize variables
  let state = null;
  let nextStates = [];
  let nextIndex = 0;

  if (symbol != null)
  {
    cachedSymbols.push(symbol);
  }

  for(let cstate of cachedStates)
  {
    state = cstate.state;
    symbol = cstate.index < cachedSymbols.length ? cachedSymbols[cstate.index] : null;

    if (symbol != null)
    {
      //Read to next state...
      nextIndex = cstate.index + 1;
      for(let nextState of nfa.doTransition(state, symbol))
      {
        nextStates.push({state: nextState, index: nextIndex});
      }
    }
    else
    {
      if (nfa.isFinalState(state)) return true;
      checkedStates.push(state);
    }

    //Read none to next state...
    nextIndex = cstate.index;
    for(let nextState of nfa.doTransition(state, EMPTY))
    {
      if (checkedStates.includes(nextState)) continue;
      if (symbol == null && nfa.isFinalState(nextState)) return true;

      nextStates.push({state: nextState, index: nextIndex});
    }
  }
  cachedStates.length = 0
  cachedStates.push(...nextStates);
  return false;
}
