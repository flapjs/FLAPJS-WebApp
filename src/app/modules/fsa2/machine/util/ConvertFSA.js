import FSA, { State } from '../FSA.js';

export function convertToNFA(fsa, dst = new FSA(false))
{
    if (!fsa.isDeterministic())
    {
        dst.copy(fsa);
        return dst;
    }

    dst.setDeterministic(false);
    return dst;
}

export function convertToDFA(fsa, dst = new FSA(true))
{
    if (fsa.isDeterministic())
    {
        dst.copy(fsa);
        return dst;
    }

    dst.setDeterministic(true);

    const startState = fsa.getStartState();

    const dfaData = {
        nfaSource: fsa,
        //To keep track of dfa states in terms of nfa sets
        dfaStateMap: new Map(),
        //Array of final dfa states
        dfaFinalStates: [],
        //To keep track of dfa transitions in terms of dfa states
        dfaTransitionMap: new Map(),
        //The resultant dfa start state
        dfaStartState: null,
        //The trap state for all missing transitions
        dfaTrapState: null
    };

    //Make new DFA start state
    const startStatesByClosure = fsa.doClosureTransition(startState);
    dfaData.dfaStartState = getDFAStateFromNFAStates(startStatesByClosure, dfaData);
    dfaData.dfaTrapState = getDFAStateFromNFAStates([], dfaData);

    //For every state from the NFA's powerset, add it to DFA with correct transitions
    const statePowerSet = getPowerSetOfStates(fsa.getStates());
    for (const nfaStates of statePowerSet)
    {
        //As long as it is not the empty set...
        if (nfaStates.length > 0)
        {
            expandNFAStatesToDFA(nfaStates, dfaData);
        }
    }

    //Make sure any unused symbols are added as transitions for every state...
    for (const dfaState of dfaData.dfaStateMap.values())
    {
        for (const symbol of fsa.getAlphabet())
        {
            //If transition for symbol does not exist...
            const dfaTransitionKey = getDFATransitionKeyFromDFAStateAndSymbol(dfaState, symbol, dfaData);
            if (!dfaData.dfaTransitionMap.has(dfaTransitionKey))
            {
                dfaData.dfaTransitionMap.set(dfaTransitionKey, [dfaState, symbol, dfaData.dfaTrapState]);
            }
        }
    }

    //Compiled dfa data to dst
    dst.clear();
    //Add states
    for (const dfaState of dfaData.dfaStateMap.values())
    {
        dst.addState(dfaState);
    }

    //Set start state
    dst.setStartState(dfaData.dfaStartState);
    //Set final states
    for (const finalState of dfaData.dfaFinalStates)
    {
        dst.setFinalState(finalState);
    }
    //Add transitions (will also add any symbols used to alphabet)
    for (const transition of dfaData.dfaTransitionMap.values())
    {
        dst.addTransition(transition[0], transition[2], transition[1]);
    }
    return dst;
}

function expandNFAStatesToDFA(nfaStates, dfaData)
{
    let fromDFAState = getDFAStateFromNFAStates(nfaStates, dfaData);
    let dfaState = null;

    let nfaTerminals = [];

    for (const symbol of dfaData.nfaSource.getAlphabet())
    {
        //Get all closed reachable states...
        for (const fromNFAState of nfaStates)
        {
            dfaData.nfaSource.doTerminalTransition(fromNFAState, symbol, nfaTerminals);
        }

        //If has reachable states...
        if (nfaTerminals.length > 0)
        {
            dfaState = getDFAStateFromNFAStates(nfaTerminals, dfaData);

            //Create transition for reachable state
            //Should guarantee to be unique for state and symbol pair
            const dfaTransitionKey = getDFATransitionKeyFromDFAStateAndSymbol(fromDFAState, symbol, dfaData);
            dfaData.dfaTransitionMap.set(dfaTransitionKey, [fromDFAState, symbol, dfaState]);
        }

        //Reset list
        nfaTerminals.length = 0;
    }
}

function getNFAStateKeyFromNFAStates(nfaStates, dfaData)
{
    let result = '';
    for (const nfaState of dfaData.nfaSource.getStates())
    {
        if (nfaStates.includes(nfaState))
        {
            result += 'x';
        }
        else
        {
            result += '-';
        }
    }
    return result;
}

function getDFATransitionKeyFromDFAStateAndSymbol(dfaState, symbol, dfaData)
{
    return dfaState.getStateID() + ';' + symbol;
}

function getDFAStateFromNFAStates(nfaStates, dfaData)
{
    const nfaStateKey = getNFAStateKeyFromNFAStates(nfaStates, dfaData);
    let result = dfaData.dfaStateMap.get(nfaStateKey);

    //If it doesn't exist, create it...
    if (!result)
    {
        let final = false;
        //Compute the label from nfa states in set notation...
        let dfaStateLabel = '{';
        for (const state of nfaStates)
        {
            if (dfaStateLabel.length > 1)
            {
                dfaStateLabel += ',';
            }
            dfaStateLabel += state.getStateLabel();

            //Check if nfa state is final state...
            if (!final)
            {
                final = dfaData.nfaSource.isFinalState(state);
            }
        }
        dfaStateLabel += '}';

        //Create the state
        result = new State(dfaStateLabel);
        dfaData.dfaStateMap.set(nfaStateKey, result);

        //If any nfa states is a final state, make dfa state final...
        if (final)
        {
            dfaData.dfaFinalStates.push(result);
        }
    }

    return result;
}

function getPowerSetOfStates(states)
{
    var result = [[]];

    for (const state of states)
    {
        for (let i = 0, len = result.length; i < len; ++i)
        {
            result.push(result[i].concat(state));
        }
    }
    return result;
}
