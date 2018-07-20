import convertToDFA from "convertNFA.js"
import DFA from 'machine/DFA.js';
const SRC = 0;
const SYMBOL = 1;
const DST = 2;

export function minimizeFSA(fsa)
{
  //check if fsa dfa, if not, convert to dfa
  let dfa = fsa.validate() ? fsa : convertToDFA(fsa);

  //find unreachable states
  let reachableState = []
  for(const transition of dfa._transitions)
  {
    const dst = transition[DST];
    if (!reachableState.includes(dst))
    {
      reachableState.push(dst);
    }
  }

  dfa._states = dfa._states.filter(function(state){
    return reachableState.includes(state);
  });

  dfa._finalStates = dfa._states.filter(function(state){
    return reachableState.includes(state);
  });

  var partitionMap = new Map();
  for (const state of dfa._states)
  {
    if(dfa._finalStates.include(state)){
      partitionMap.set(state, 0);
    }
    else{
      partitionMap.set(state, 1);
    }
  }

  //partition all states into equivalent groups
  partition(dfa, partitionMap);
}


function partition(dfa, partitionNow)
{
  let newPartition = [];
  for(const state of dfa._states)
  {
    let alphabet = dfa.getAlphabet();
    for(const char of alphabet)
    {
      let newState = dfa.doTransition(state, char);
      let newClass = partitionMap.get(newState);
    }
  }

}
