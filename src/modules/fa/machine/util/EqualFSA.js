import { convertToDFA } from './ConvertFSA.js';
import { intersectDFA } from './IntersectFSA.js';
import { invertDFA } from './InvertDFA.js';

/**
 * Use isEquivalentFSAWithWitnessString instead.
 * 
 * @deprecated
 * @param {FSA} fsa1 An finite automata.
 * @param {FSA} fsa2 The other finite automata.
 * @returns {boolean} Whether the 2 automata are equivalent.
 */
export function isEquivalentFSA(fsa1, fsa2)
{
    const dfa1 = fsa1.isDeterministic() ? fsa1 : convertToDFA(fsa1);
    const dfa2 = fsa2.isDeterministic() ? fsa2 : convertToDFA(fsa2);
    return isEquivalentDFA(dfa1, dfa2).value;
}

export function isEquivalentFSAWithWitness(fsa1, fsa2)
{
    const dfa1 = fsa1.isDeterministic() ? fsa1 : convertToDFA(fsa1);
    const dfa2 = fsa2.isDeterministic() ? fsa2 : convertToDFA(fsa2);
    return isEquivalentDFA(dfa1, dfa2);
}

/*
* this function returns an object of the form {value:boolean, witnessString:string}
* where value is true when two DFAs describe the same language and false otherwise.
* witnessString is a string that shows one string that demonstrates the non-equivalence
* of the two machines of our interest. witnessString is set to null when two DFAs are 
* equivalent or when their alphabet are not the same.
*/
export function isEquivalentDFA(dfa1, dfa2)
{
    // L(dfa3) = L(dfa1) && !L(dfa2)
    let dfa3 = intersectionOfComplement(dfa1, dfa2);
    if (!dfa3) 
    {
        //console.log("dfa1 and dfa2 use different alphabets");
        return {
            value: false,
            witnessString: null // this means the alphabet of two machines are not the same
        };
    }
    let dfa3acceptssomething = isLanguageNotEmpty(dfa3);
    if (dfa3acceptssomething) 
    {
        //console.log(`dfa1 accepts ${dfa3acceptssomething} while dfa2 doesn't`);
        return {
            value: false,
            witnessString: dfa3acceptssomething
        };
    }
    let dfa4 = intersectionOfComplement(dfa2, dfa1);
    if (!dfa4) 
    {
        //console.log("dfa1 and dfa2 use different alphabets");
        return {
            value: false,
            witnessString: null // this means these two DFAs have different alphabet
        };
    }
    let dfa4acceptssometing = isLanguageNotEmpty(dfa4);
    if (dfa4acceptssometing) 
    {
        //console.log(`dfa2 accepts ${dfa4acceptssomething} while dfa1 doesn't`);
        return {
            value: false,
            witnessString: dfa4acceptssometing
        };
    }

    // if the user reached this statement, the two DFA's are equal and we should return {true, ''}
    return {
        value: true,
        witnessString: null
    };
    // L(dfa4) = L(dfa2) && !L(dfa1)
}

// TODO: move helper functions to seperate file
// intersection is closed for DFA
function intersectionOfComplement(dfa1, dfa2)
{
    // Returns false if used alphabet is different, else returns the common alphabet
    const commonAlphabet = haveTheSameUsedAlphabet(dfa1, dfa2);
    if (!commonAlphabet)
        return null;

    const inverted = invertDFA(dfa2);
    return intersectDFA(dfa1, inverted);
}

export function isLanguageNotEmpty(dfa)
{
    //Perform BFS from start state. If a final state can be reached, then the language
    //is not empty, and the path is a witness. Else if no final states are ever reached,
    //the language is empty
    const explored = [];
    const frontier = [dfa.getStartState()];
    const path = new Map();
    path.set(dfa.getStartState(), '');

    while (frontier.length) 
    {
        let current = frontier.shift();
        explored.push(current);
        let pathUpTill = path.get(current);

        if (dfa.isFinalState(current)) 
        {
            return pathUpTill;
        }
        for (const transition of dfa.getOutgoingTransitions(current)) 
        {
            let dest = transition[2];
            if (!explored.includes(dest) && !frontier.includes(dest)) 
            {
                frontier.push(dest);
                let symbol = transition[1];
                path.set(dest, pathUpTill + symbol);
            }
        }
    }
    return false;
}

// TODO: same function in intersectFSA
function haveTheSameUsedAlphabet(m1, m2)
{
    let alphabet1 = new Set();
    let alphabet2 = new Set();
    for (const symbol of m1.getAlphabet()) 
    {
        if (m1.isUsedSymbol(symbol)) 
        {
            alphabet1.add(symbol);
        }
    }
    for (const symbol of m2.getAlphabet()) 
    {
        if (m2.isUsedSymbol(symbol)) 
        {
            alphabet2.add(symbol);
        }
    }
    if (alphabet1.size != alphabet2.size)
        return false;
    for (const symbol of alphabet1) 
    {
        if (!alphabet2.has(symbol))
            return false;
    }
    return alphabet1;
}
