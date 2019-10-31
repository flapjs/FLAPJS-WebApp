const MAX_COMPUTATION_STEPS = 1000;

export function solvePDA(pda, input)
{
    if (typeof input === 'string') input = input[Symbol.iterator]();

    //Solve it with non-determinism
    const cachedStates = [];
    const cachedSymbols = [];

    //Start with the start state...
    const startState = pda.getStartState();
    //(index refers to the "level" of computation)
    cachedStates.push({state: startState, stack: [], index: 0});
    //...and any state defined similarly by closure
    for (const relatedStateAndStack of pda.doClosureTransition(startState, []))
    {
        cachedStates.push({state: relatedStateAndStack[0], stack : relatedStateAndStack[1], index: 0});
    }

    //The next symbol to compute...
    let symbol = null;

    //Just to be safe from infinite loops...
    let counter = 0;
    while(cachedStates.length > 0)
    {
        symbol = input.next().value;
        if (solvePDAByStep(pda, symbol, cachedStates, cachedSymbols))
        {
            return true;
        }

        //HACK: This is to stop any infinite loops! This will be fixed in the future!
        ++counter;
        if (counter > MAX_COMPUTATION_STEPS)
        {
            return false;
        }
    }

    return false;
}

//TODO: When an empty transition occurs, it does a closure transition.
//The closure chain will be stored as a group
//Any future transitions must not re-enter the group
export function solvePDAByStep(pda, symbol, cachedStates, cachedSymbols)
{
    //initialize variables
    let state = null;
    let stack = null;
    let nextStates = [];
    let nextIndex = 0;

    if (symbol)
    {
        cachedSymbols.push(symbol);
    }

    for(const cstate of cachedStates)
    {
        state = cstate.state;
        stack = cstate.stack;
        symbol = cstate.index < cachedSymbols.length ? cachedSymbols[cstate.index] : null;

        if (symbol)
        {
            //Read to next state...
            nextIndex = cstate.index + 1;
            for(let nextState of pda.doTerminalTransition(state, symbol, stack))
            {
                nextStates.push({state: nextState[0], stack: nextState[1], index: nextIndex});
            }
        }
        else
        {
            if (pda.isFinalState(state)) return true;
        }

        //Read none to next state...
        nextIndex = cstate.index;
    }
    cachedStates.length = 0;
    cachedStates.push(...nextStates);
    return false;
}
