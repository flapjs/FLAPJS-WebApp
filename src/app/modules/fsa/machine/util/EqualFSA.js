import { convertToDFA } from './convertFSA.js';

export function isEquivalentFSA(fsa1, fsa2)
{
  const dfa1 = fsa1.isDeterministic() ? fsa1 : convertToDFA(fsa1);
  const dfa2 = fsa2.isDeterministic() ? fsa2 : convertToDFA(fsa2);
  return isEquivalentDFA(dfa1, dfa2);
};

export function isEquivalentDFA(dfa1, dfa2)
{
  //Union the alphabets
  const alphabet = new Set();
  for(let symbol of dfa1.getAlphabet()) { alphabet.add(symbol); }
  for(let symbol of dfa2.getAlphabet()) { alphabet.add(symbol); }

  //TODO: to do later... :P

  let s1 = null;
  let s2 = null;
  let newSet = null;

  //1. For every state q in Q1 U Q2, MakeSet(q)
  const sets = new Map();
  const stack = [];
  // - For each state q_1 in Q1, make {q_1}
  let flag1 = false;
  for(const q of dfa1.getStates())
  {
    s1 = "1_" + q.getStateID();
    sets.set(s1, [s1]);
    flag1 = true;
  }
  // - For each state q_2 in Q2, make {q_2}
  let flag2 = false;
  for(const q of dfa2.getStates())
  {
    s2 = "2_" + q.getStateID();
    sets.set(s2, [s2]);
    flag2 = true;
  }
  //This basically checks for the empty cases...
  // - If no states exists in both, they are equivalent
  if (sets.size == 0) return true;
  // - If no states exists in either, they are not equivalent
  if (!flag1 || !flag2) return false;

  //2. Union(s1, s2) and Push(s1, s2) to stack S
  // - Union(q_1, q_2) to refer to the same set
  s1 = "1_" + dfa1.getStartState().getStateID();
  s2 = "2_" + dfa2.getStartState().getStateID();
  newSet = union(sets.get(s1), sets.get(s2));
  sets.set(s1, newSet);
  sets.set(s2, newSet);
  // - Push(q_1, q_2) to stack
  stack.push([s1, s2]);

  //3. While S is not empty:
  while(stack.length > 0)
  {
    //  a. Pop pair(q1, q2) from S
    let set1 = null;
    let set2 = null;
    let pair = stack.pop();
    //  b. For each a of Alphabet
    for(const a of alphabet)
    {
      //    i. r1 = Find(Transition(q1, a))
      const s1ID = pair[0].substring(2);
      const s1SRC = dfa1.getStateByID(s1ID);
      const s1Result = dfa1.doTransition(s1SRC, a);
      if (s1Result.length > 0)
      {
        s1 = "1_" + s1Result[0].getStateID();
        set1 = sets.get(s1);
      }
      //    ii. r2 = Find(Transition(q2, a))
      const s2ID = pair[1].substring(2);
      const s2SRC = dfa2.getStateByID(s2ID);
      const s2Result = dfa2.doTransition(s2SRC, a);
      if (s2Result.length > 0)
      {
        s2 = "2_" + s2Result[0].getStateID();
        set2 = sets.get(s2);
      }

      // - if either lead no where, it is not a valid pair to work with.
      if (!set1 || !set2) break;

      //    iii. if r1 != r2
      if (set1 !== set2)
      {
        //      1. Union(r1, r2) and Push(r1, r2) to S
        //        - Union(q_1, q_2) to refer to the same set
        newSet = union(set1, set2);
        sets.set(s1, newSet);
        sets.set(s2, newSet);
        // - Update all elements in set to refer to the same set
        for(const key of set1)
        {
          sets.set(key, newSet);
        }
        // - Update all elements in set to refer to the same set
        for(const key of set2)
        {
          sets.set(key, newSet);
        }
        //        - Push(q_1, q_2) to stack
        stack.push([s1, s2]);
      }
    }
  }
  //4. if no set contains a final and a non-final state
  for(const states of sets.values())
  {
    let isFinal = false;
    let isNotFinal = false;
    for(const state of states)
    {
      if (state.startsWith("1_"))
      {
        // - Whether a state that belongs to the first machine is a final or not
        const stateID = state.substring(2);
        const stateSRC = dfa1.getStateByID(stateID);
        if (dfa1.isFinalState(stateSRC))
        {
          isFinal = true;
        }
        else
        {
          isNotFinal = true;
        }
      }
      else if (state.startsWith("2_"))
      {
        // - Whether a state that belongs to the second machine is a final or not
        const stateID = state.substring(2);
        const stateSRC = dfa2.getStateByID(stateID);
        if (dfa2.isFinalState(stateSRC))
        {
          isFinal = true;
        }
        else
        {
          isNotFinal = true;
        }
      }
      else
      {
        throw new Error("Found state from unknown machine.");
      }
    }

    // - If this set contains BOTH a final and non-final state, then it is not equal
    if (isFinal && isNotFinal)
    {
      return false;
    }
  }
  return true;
};

function union(set1, set2)
{
  const set = new Set();
  for(const e of set1)
  {
    set.add(e);
  }
  for(const e of set2)
  {
    set.add(e);
  }
  return Array.from(set);
}
