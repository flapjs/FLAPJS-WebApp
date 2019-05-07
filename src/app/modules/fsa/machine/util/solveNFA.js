//This ASSUMES that the passed-in machine is an NFA! (and not a DFA)
export function solveNFA(nfa, input)
{
    if (typeof input === 'string') input = input[Symbol.iterator]();

    let cachedStates = [];
    let cachedSymbols = [];
    cachedStates.push({state: nfa.getStartState(), index: 0});
    for (let currState of nfa.doClosureTransition(nfa.getStartState()))
    {
        cachedStates.push({state: currState , index: 0});
    }
    let checkedStates = [];
    let symbol = null;

    let counter = 0;

    while(cachedStates.length > 0)
    {
        symbol = input.next().value;
        let res = solveNFAbyStep(nfa, symbol, cachedStates, cachedSymbols, checkedStates);
        if (res) return true;

        //HACK: This is to stop any infinite loops! This will be fixed in the future!
        ++counter;
        if (counter > 1000)
        {
            return false;
        }
    }

    return false;
}

//TODO: When an empty transition occurs, it does a closure transition.
//The closure chain will be stored as a group
//Any future transitions must not re-enter the group
export function solveNFAbyStep(nfa, symbol, cachedStates, cachedSymbols, checkedStates)
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
            for(let nextState of nfa.doTerminalTransition(state, symbol))
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
    /*for(let nextState of nfa.doTransition(state,EMPTY))
    {
      if (checkedStates.includes(nextState)) continue;
      if (symbol == null && nfa.isFinalState(nextState)) return true;

      nextStates.push({state: nextState, index: nextIndex});
    }*/
    }
    cachedStates.length = 0;
    cachedStates.push(...nextStates);
    return false;
}
