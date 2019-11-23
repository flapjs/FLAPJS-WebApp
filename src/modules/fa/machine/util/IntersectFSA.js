import FSA from '../FSA.js';
// TODO: add function headers-

// TODO: explain intersected FSA
export function intersectFSA(fsa1, fsa2, dst = new FSA(true))
{
    throw new Error('Unsupported operation - not yet implemented');
}

export function intersectDFA(dfa1, dfa2, dst = new FSA(true))
{
    if (!checkSameAlphabet(dfa1, dfa2))
        throw new Error('Mismatched machine alphabet');

    const alphabet = dfa1.UNSAFE_getAlphabet();
    const start1 = dfa1.getStartState();
    const start2 = dfa2.getStartState();

    if (!start1 && !start2)
    {
        dst.clear();
        return dst;
    }
    else if (!start1)
    {
        return dst.copy(dfa2);
    }
    else if (!start2)
    {
        return dst.copy(dfa1);
    }

    const pairIDs = new Map();
    const finalPairIDs = new Set();
    const transitions = [];

    //Add start state pair
    const startPair = [start1, start2];
    const startPairID = start1.getStateID() + ':' + start2.getStateID();
    if (dfa1.isFinalState(start1) && dfa2.isFinalState(start2))
    {
        finalPairIDs.add(startPairID);
    }
    pairIDs.set(startPairID, startPair);

    //Add remaining states by symbol
    const remainingPairIDs = [];
    remainingPairIDs.push(startPairID);
    while (remainingPairIDs.length > 0)
    {
        const parentPairID = remainingPairIDs.pop();
        const parentPair = pairIDs.get(parentPairID);
        const parent1 = parentPair[0];
        const parent2 = parentPair[1];

        const result = [];
        for (const symbol of alphabet)
        {
            let state1;
            let state2;

            dfa1.doTransition(parent1, symbol, false, result);
            if (result.length !== 1)
            {
                throw new Error('Found non-deterministic transition from \'' +
                    parent1.getStateLabel() + '\' for \'' + symbol + '\' - transitions to \'' + result.join(',') + '\'');
            }
            state1 = result[0];
            result.length = 0;

            dfa2.doTransition(parent2, symbol, false, result);
            if (result.length !== 1)
            {
                throw new Error('Found non-deterministic transition from \'' +
                    parent2.getStateLabel() + '\' for \'' + symbol + '\' - transitions to \'' + result.join(',') + '\'');
            }
            state2 = result[0];
            result.length = 0;

            //Get cartesian-product equivalent
            const newPairID = state1.getStateID() + ':' + state2.getStateID();
            if (!pairIDs.has(newPairID))
            {
                pairIDs.set(newPairID, [state1, state2]);
                remainingPairIDs.push(newPairID);

                //Only accept if both do
                if (dfa1.isFinalState(state1) && dfa2.isFinalState(state2))
                {
                    finalPairIDs.add(newPairID);
                }
            }

            //Add the transition
            transitions.push([
                /*FROM PAIR ID*/ parentPairID,
                /*SYMBOL*/ symbol,
                /*TO PAIR ID*/ newPairID
            ]);
        }
    }

    dst.clear();

    //Add state/final pairs to the machine
    const pairToState = new Map();
    for (const [statePairID, statePair] of pairIDs.entries())
    {
        const state = dst.createState('(' + statePair[0].getStateLabel() + ',' + statePair[1].getStateLabel() + ')');
        if (finalPairIDs.has(statePairID))
        {
            dst.setFinalState(state, true);
        }
        pairToState.set(statePairID, state);
    }

    //Add start pair to the machine
    const startState = pairToState.get(startPairID);
    if (!startState) throw new Error('Unable to find start state for pair');
    dst.setStartState(startState);

    //Add transitions to the machine
    for (const transition of transitions)
    {
        const fromPairID = transition[0];
        const symbol = transition[1];
        const toPairID = transition[2];

        const fromState = pairToState.get(fromPairID);
        const toState = pairToState.get(toPairID);
        if (!fromState || !toState) throw new Error('Cannot find state for pair');

        dst.addTransition(fromState, toState, symbol);
    }

    return dst;
}

function checkSameAlphabet(fsa1, fsa2)
{
    const alphabet = new Set();
    for (let symbol of fsa1.getAlphabet()) { alphabet.add(symbol); }

    for (let symbol of fsa2.getAlphabet())
    {
        if (!alphabet.has(symbol))
        {
            return false;
        }
        else
        {
            alphabet.delete(symbol);
        }
    }

    return alphabet.size <= 0;
}
