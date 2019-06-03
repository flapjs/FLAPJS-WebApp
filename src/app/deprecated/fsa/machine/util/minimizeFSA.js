import {convertToDFA} from 'deprecated/fsa/machine/util/convertNFA.js';
import DFA from 'deprecated/fsa/machine/DFA.js';
// const SRC = 0;
// const SYMBOL = 1;
const DST = 2;

export function minimizeFSA(fsa)
{
    let dfa = fsa;
    if(!(fsa instanceof DFA))
    {
    //check if fsa dfa, if not, convert to dfa
        dfa = convertToDFA(fsa);

    }

    if(!dfa.validate())
    {
        throw new Error('Machine is not valid');
    }
    if(dfa._states.length == 0) return dfa;
    //find unreachable states
    let reachableState = [];
    for(const transition of dfa._transitions)
    {
        const dst = transition[DST];
        if (!reachableState.includes(dst))
        {
            reachableState.push(dst);
        }
    }

    dfa._states = dfa._states.filter(function(state)
    {
        return reachableState.includes(state);
    });
    dfa._finalStates = dfa._finalStates.filter(function(state)
    {
        return reachableState.includes(state);
    });
    //split between final states and non-final states
    const nonFinalStates = dfa._states.filter(function(state)
    {
        return !dfa._finalStates.includes(state);
    });

    //partition all states into equivalent groups
    let completePartition = partition(dfa, [nonFinalStates,dfa._finalStates]);

    return makeNewDFA(dfa, completePartition);
}

//make minimized dfa according to the partition
function makeNewDFA(dfa, partition)
{
    let newDFA = new DFA();
    for(var i = 0; i < partition.length; i++)
    {
        let currState = partition[i][0];
        newDFA.newState(currState);
    }
    for( const currState of newDFA._states)
    {
        let alphabet = dfa.getAlphabet();
        for(const char of alphabet)
        {
            let newState = dfa.doTransition(currState, char);
            let classNum = getClassOfElement(partition, newState);
            newDFA.newTransition(currState, partition[classNum][0], char);
        }
    }
    for(const state of dfa._finalStates)
    {
        let classNum = getClassOfElement(partition, state);
        newDFA.setFinalState(partition[classNum][0]);
    }
    if(dfa.getStartState())
    {
        let classNum = getClassOfElement(partition, dfa.getStartState());
        newDFA.setStartState(partition[classNum][0]);
    }
    return newDFA;
}


//recursively partition through states
function partition(dfa, partitionNow)
{
    let newPartition = [];
    //create a map for observation and state in this iteration
    let obsMap = new Map();
    for(const state of dfa._states)
    {

        let obs = [];
        let alphabet = dfa.getAlphabet();
        for(const char of alphabet)
        {
            let newState = dfa.doTransition(state, char);
            let newClass = getClassOfElement(partitionNow, newState);
            obs.push((char, newClass));
        }
        setClassOfElement(partitionNow, newPartition, obsMap, state,obs);
        obsMap.set(obs, state);
    }
    if(equalPartition(partitionNow, newPartition))
    {
        return newPartition;
    }
    else
    {
        return partition(dfa, newPartition);
    }
}


//get the partition that currState belongs to
function getClassOfElement(partition, currState)
{
    for(var i = 0; i < partition.length; i++)
    {
        if(partition[i].includes(currState))
        {
            return i;
        }
    }
}

//set the newPartition of currState
function setClassOfElement(partitionNow, newPartition, obsMap, state, obs)
{
    let setComplete = 0;
    for(var key of obsMap.keys())
    {
        if (JSON.stringify(key) == JSON.stringify(obs))
        {
            let similarState = obsMap.get(key);
            if(getClassOfElement(partitionNow, state) == getClassOfElement(partitionNow, similarState))
            {
                let classIndex = getClassOfElement(newPartition, similarState);
                newPartition[classIndex].push(state);
                setComplete = 1;
            }
        }
    }
    if(setComplete == 0)
    {
        let currList = [state];
        newPartition.push(currList);
    }
}

//check if two partition are equal
function equalPartition(partitionNow, newPartition)
{
    partitionNow.sort();
    newPartition.sort();
    return JSON.stringify(partitionNow)==JSON.stringify(newPartition);
}
