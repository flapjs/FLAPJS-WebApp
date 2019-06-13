const MAX_COMPUTATION_STEPS = 1000;

export function solveFSA(fsa, input)
{
    if (typeof input === 'string') input = input[Symbol.iterator]();

    if (fsa.isDeterministic())
    {
        //Solve if the DFA way...
        let state = fsa.getStartState();
        let symbol = null;

        //Is testing null after assignment
        while ((symbol = input.next().value))
        {
            const states = fsa.doTransition(state, symbol);
            if (states.length < 1) return false;
            //DFA's should only return 1 output
            state = states[0];
        }
        return fsa.isFinalState(state);
    }
    else
    {
        //Solve it the NFA way...
        const cachedStates = [];
        const cachedSymbols = [];

        //Start with the start state...
        const startState = fsa.getStartState();
        //(index refers to the "level" of computation)
        cachedStates.push({ state: startState, index: 0 });
        //...and any state defined similarly by closure...
        for (const relatedState of fsa.doClosureTransition(startState))
        {
            cachedStates.push({ state: relatedState, index: 0 });
        }

        //The next symbol to compute...
        let symbol = null;

        //Just to be safe from infinite loops...
        let counter = 0;
        while (cachedStates.length > 0)
        {
            symbol = input.next().value;
            if (solveFSAByStep(fsa, symbol, cachedStates, cachedSymbols))
            {
                return true;
            }

            //HACK: This is to stop any infinite loops! This should be fixed in the future!
            ++counter;
            if (counter > MAX_COMPUTATION_STEPS)
            {
                return false;
            }
        }

        return false;
    }
}

//TODO: When an empty transition occurs, it does a closure transition.
//The closure chain will be stored as a group
//Any future transitions must not re-enter the group
export function solveFSAByStep(nfa, symbol, cachedStates, cachedSymbols)
{
    //initialize variables
    let state = null;
    let nextStates = [];
    let nextIndex = 0;

    if (symbol)
    {
        cachedSymbols.push(symbol);
    }

    for (const cstate of cachedStates)
    {
        state = cstate.state;
        symbol = cstate.index < cachedSymbols.length ? cachedSymbols[cstate.index] : null;

        if (symbol)
        {
            //Read to next state...
            nextIndex = cstate.index + 1;
            for (const nextState of nfa.doTerminalTransition(state, symbol))
            {
                nextStates.push({ state: nextState, index: nextIndex });
            }
        }
        else
        {
            if (nfa.isFinalState(state)) return true;
        }

        //Read none to next state...
        nextIndex = cstate.index;
    }
    cachedStates.length = 0;
    cachedStates.push(...nextStates);
    return false;
}
