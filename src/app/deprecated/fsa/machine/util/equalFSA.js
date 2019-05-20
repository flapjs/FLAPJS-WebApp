import DFA from 'deprecated/fsa/machine/DFA.js';
import { convertToDFA } from 'deprecated/fsa/machine/util/convertNFA.js';

export function isEquivalentFSA(fsa1, fsa2)
{
    if (!(fsa1 instanceof DFA) || !fsa1.validate())
    {
        fsa1 = convertToDFA(fsa1);
    }
    if (!(fsa2 instanceof DFA) || !fsa2.validate())
    {
        fsa2 = convertToDFA(fsa2);
    }
    return isEquivalentDFA(fsa1, fsa2);
}

export function isEquivalentDFA(dfa1, dfa2)
{
    const alphabet = union(dfa1.getAlphabet(), dfa2.getAlphabet());
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
        s1 = '1_' + q;
        sets.set(s1, [s1]);
        flag1 = true;
    }
    // - For each state q_2 in Q2, make {q_2}
    let flag2 = false;
    for(const q of dfa2.getStates())
    {
        s2 = '2_' + q;
        sets.set(s2, [s2]);
        flag2 = true;
    }
    // - If no states exists in both, they are equivalent
    if (sets.size == 0) return true;
    // - If no states exists in either, they are not equivalent
    if (!flag1 || !flag2) return false;

    //2. Union(s1, s2) and Push(s1, s2) to stack S
    // - Union(q_1, q_2) to refer to the same set
    s1 = '1_' + dfa1.getStartState();
    s2 = '2_' + dfa2.getStartState();
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
            s1 = '1_' + dfa1.doTransition(pair[0].substring(2), a);
            set1 = sets.get(s1);
            //    ii. r2 = Find(Transition(q2, a))
            s2 = '2_' + dfa2.doTransition(pair[1].substring(2), a);
            set2 = sets.get(s2);

            // - if either lead no where, it is not a valid pair to work with.
            if (!set1 || !set2) return false;

            //    iii. if r1 != r2
            if (set1 != set2)
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
            if (state.startsWith('1_'))
            {
                // - Whether a state that belongs to the first machine is a final or not
                if (dfa1.isFinalState(state.substring(2)))
                {
                    isFinal = true;
                }
                else
                {
                    isNotFinal = true;
                }
            }
            else if (state.startsWith('2_'))
            {
                // - Whether a state that belongs to the second machine is a final or not
                if (dfa2.isFinalState(state.substring(2)))
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
                throw new Error('Found state from unknown machine.');
            }
        }

        // - If this set contains BOTH a final and non-final state, then it is not equal
        if (isFinal && isNotFinal)
        {
            return false;
        }
    }
    return true;
}

function union(set1, set2)
{
    const result = [];
    for(const e of set1)
    {
        result.push(e);
    }
    for(const e of set2)
    {
        if (!set1.includes(e))
        {
            result.push(e);
        }
    }
    return result;
}
