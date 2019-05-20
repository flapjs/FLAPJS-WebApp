export function solveDFA(dfa, input)
{
    if (typeof input == 'string') input = input[Symbol.iterator]();
  
    let state = dfa.getStartState();
    let symbol = null;
    while((symbol = input.next().value) != null)
    {
        state = dfa.doTransition(state, symbol);
    }
    return dfa.isFinalState(state);
}
