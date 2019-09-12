import DFA from 'deprecated/fsa/machine/DFA.js';

export function convertToDFA(nfa, dst=null)
{

    //Avoid runtime errors for empty nfas
    if(nfa.getStates().length == 0) return;

    const result = dst || new DFA();

    const startState = nfa.getStartState();

    //Make new DFA start state
    let nextStates = nfa.doClosureTransition(startState);
    newDFAStateFromNFA(result, nfa, nextStates);

    //For every state from the NFA's powerset, add it to DFA with correct transitions
    const powerSetStates = nfa.getPowerSet();
    for(const powerSetState of powerSetStates) 
    {
        // console.log('Adding to DFA: ' + getStateFromSet(powerSetState));
        if(powerSetState.length != 0)
            expandPowersetStateToDFA(powerSetState, nfa, result);
    }

    //Create trap state
    const trapState = result.newState('{}');

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
            }
        }
    }

    return result;
}

/* Inspired by expandNFAStateToDFA, it takes a powerSetState, which is a set
 * of NFA states from the powerset (e.g. [q1, q1]) and adds it to the DFA as a
 * single state (e.g. {q1, q2}) and adds its transitions
 */
function expandPowersetStateToDFA(powerSetState, nfa, dfa) 
{
    const result = [];
    const alphabet = nfa.getAlphabet();
    const state = getStateFromSet(powerSetState);

    if(!dfa.hasState(state)) 
    {
        result.push(newDFAStateFromNFA(dfa, nfa, powerSetState));
    }

    let terminals = [];
    let dfaState = null;

    for(const symbol of alphabet)
    {
        //Get all closed reachable states...
        for(const s of powerSetState)
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

/*
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
*/

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
    return '{' + nfaStates.join(',') + '}';
}

/*
function getSetFromState(dfaState)
{
    return dfaState.substring(1, dfaState.length - 1).split(',');
}
*/