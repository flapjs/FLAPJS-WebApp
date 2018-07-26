import DFA from 'machine/DFA.js';
import { EMPTY } from 'machine/Symbols.js';

export function convertToDFA(nfa)
{
  const result = new DFA();

  const alphabet = nfa.getAlphabet();
  const startState = nfa.getStartState();

  //Make new DFA start state
  let nextStates = nfa.doClosureTransition(startState);
  const newStartState = newDFAStateFromNFA(result, nfa, nextStates);

  //Start expansion with the start state
  const states = [];
  states.push(newStartState);

  //While there are still more states to expand from...
  while(states.length > 0)
  {
    const nextState = states.shift();
    nextStates = expandNFAStateToDFA(nextState, nfa, result);

    //Push all nextStates to end of states
    for(const s of nextStates)
    {
      states.push(s);
    }
  }

  //Create trap state
  const trapState = result.newState("qt");
  let flag = false;

  //Check for the new alphabet...
  const newAlphabet = result.getAlphabet();
  for(const state of result.getStates())
  {
    for(const symbol of newAlphabet)
    {
      //If transition for this symbol does not exist...
      if (!result.doTransition(state, symbol))
      {
        //Create it
        result.newTransition(state, trapState, symbol);

        if (state !== trapState) flag = true;
      }
    }
  }
  
  //Delete the trap state if it was not used
  if (!flag)
  {
    result.deleteState(trapState);
  }

  return result;
}

function expandNFAStateToDFA(state, nfa, dfa)
{
  const result = [];
  const alphabet = nfa.getAlphabet();

  let terminals = [];
  let nfaStates = null;
  let dfaState = null;

  for(const symbol of alphabet)
  {
    //Get all closed reachable states...
    nfaStates = getSetFromState(state);
    for(const s of nfaStates)
    {
      nfa.doTerminalTransition(s, symbol, terminals);
    }

    //If has reachable states...
    if (terminals.length > 0)
    {
      dfaState = getStateFromSet(terminals);

      //Create state if it does not exist...
      if (!dfa.hasState(dfaState))
      {
        dfaState = newDFAStateFromNFA(dfa, nfa, terminals);
        result.push(dfaState);
      }

      //Create transition for reachable state
      dfa.newTransition(state, dfaState, symbol);
    }

    //Reset list
    terminals.length = 0;
  }

  return result;
}

function newDFAStateFromNFA(dfa, nfa, nfaStates)
{
  const result = dfa.newState(getStateFromSet(nfaStates));

  //If the NFA states contain a final, then DFA state should be final
  for(const s of nfaStates)
  {
    if (nfa.isFinalState(s))
    {
      dfa.setFinalState(result);
      break;
    }
  }

  return result;
}

function getStateFromSet(nfaStates)
{
  nfaStates.sort();
  return "{" + nfaStates.join(",") + "}";
}

function getSetFromState(dfaState)
{
  return dfaState.substring(1, dfaState.length - 1).split(",");
}
