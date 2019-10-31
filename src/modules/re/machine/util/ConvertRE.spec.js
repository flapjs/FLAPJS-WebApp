import {convertToNFA} from '../REUtils.js';
import FSA, {EMPTY_SYMBOL} from '@flapjs/modules/fa/machine/FSA.js';
// eslint-disable-next-line no-unused-vars
import RE, {EMPTY, CONCAT, UNION, KLEENE, SIGMA, EMPTY_SET} from '../RE.js';

function testConvertRE(convertedFSA, expectedFSA, expectedResult=true) 
{
    test('Test Converted RE to FSA equivalence with FSA', () => 
    {
        expect(compareConvertRE(convertedFSA, expectedFSA)).toBe(expectedResult);
    });
}

function compareConvertRE(convertedFSA, expectedFSA) 
{
    let sameStates, sameStart, sameFinal, sameTransitions;
    sameStates = sameStart = sameFinal = sameTransitions = true;
    //Same states (by label)
    if (convertedFSA.getStates().length != expectedFSA.getStates().length) 
    {
        sameStates = false;
    }
    else 
    {
        for (const state of convertedFSA.getStates()) 
        {
            if (!expectedFSA.hasStateWithLabel(state.getStateLabel()))
                sameStates = false;
        }
    }
    //Same start
    if (convertedFSA.getStartState().getStateLabel() != expectedFSA.getStartState().getStateLabel()) 
    {
        sameStart = false;
    }
    //Same final state (there should only be one)
    if (convertedFSA.getFinalStates().length != expectedFSA.getFinalStates().length) 
    {
        sameFinal = false;
    }
    else 
    {
        let convertedFinals = [];
        let expectedFinals = [];
        for (const convertedFinalState of convertedFSA.getFinalStates().values()) 
        {
            convertedFinals.push(convertedFinalState.getStateLabel());
        }
        for (const expectedFinalState of expectedFSA.getFinalStates().values()) 
        {
            expectedFinals.push(expectedFinalState.getStateLabel());
        }
        if(convertedFinals[0] != expectedFinals[0])
            sameFinal = false;
    }
    //Same transitions
    if (convertedFSA.getTransitions().length != expectedFSA.getTransitions().length) 
    {
        sameTransitions = false;
    }
    else 
    {
        let convertedTransitions = [];
        let expectedTransitions = [];
        for (const transition of convertedFSA.getTransitions()) 
        {
            for (const symbol of transition.getSymbols()) 
            {
                convertedTransitions.push([transition._from.getStateLabel(), transition._to.getStateLabel(), symbol]);
            }
        }
        for (const transition of expectedFSA.getTransitions()) 
        {
            for (const symbol of transition.getSymbols()) 
            {
                expectedTransitions.push([transition._from.getStateLabel(), transition._to.getStateLabel(), symbol]);
            }
        }
        //console.log(convertedTransitions);
        //console.log(expectedTransitions);
        if (convertedTransitions.length != expectedTransitions.length)
            sameTransitions = false;
        else 
        {
            for ( const transition of convertedTransitions) 
            {
                if ( !containsArray(expectedTransitions, transition))
                    sameTransitions = false;
            }
        }
    }
    //console.log(`sameStates = ${sameStates}, sameStart = ${sameStart}, sameFinal = ${sameFinal}, sameTransitions = ${sameTransitions}`)
    return sameStates && sameStart && sameFinal && sameTransitions;
}

function containsArray(array, subarray) 
{
    var hash = {};
    for(var i=0; i<array.length; i++) 
    {
        hash[array[i]] = i;
    }
    return hash.hasOwnProperty(subarray);
}

//Build different FSA's and call testConvertRE

// RE of one variable only "a" (including within parenthesis "(a)")
describe('Converting RE - "a": ', () => 
{
    let machine = new FSA(false);
    const state0 = machine.createState('q0');
    const state1 = machine.createState('q1');
    machine.addTransition(state0, state1, 'a');
    machine.setStartState(state0);
    machine.setFinalState(state1);

    let regex = new RE('a');
    testConvertRE(convertToNFA(regex), machine, true);

    regex = new RE('(a)');
    testConvertRE(convertToNFA(regex), machine, true);
});

// RE of simple union "a " + UNION + " b" (including within parenthesis "(a " + UNION + " b)")
describe('Converting RE - "a ' + UNION + ' b"', () => 
{
    let machine = new FSA(false);
    const state0 = machine.createState('q0');
    const state1 = machine.createState('q1');
    const state2 = machine.createState('q2');
    const state3 = machine.createState('q3');
    const state4 = machine.createState('q4');
    const state5 = machine.createState('q5');
    machine.addTransition(state0, state1, EMPTY_SYMBOL);
    machine.addTransition(state0, state3, EMPTY_SYMBOL);
    machine.addTransition(state1, state2, 'a');
    machine.addTransition(state2, state5, EMPTY_SYMBOL);
    machine.addTransition(state3, state4, 'b');
    machine.addTransition(state4, state5, EMPTY_SYMBOL);
    machine.setStartState(state0);
    machine.setFinalState(state5);

    let regex = new RE('a' + UNION + 'b');
    testConvertRE(convertToNFA(regex), machine, true);

    regex = new RE('(a' + UNION + 'b)');
    testConvertRE(convertToNFA(regex), machine, true);
});

// RE of simple concat "ab" (including within parenthesis "(ab)")
describe('Converting RE - "ab"', () => 
{
    let machine = new FSA(false);
    const state0 = machine.createState('q0');
    const state1 = machine.createState('q1');
    const state2 = machine.createState('q2');
    const state3 = machine.createState('q3');
    machine.addTransition(state0, state1, 'a');
    machine.addTransition(state1, state2, EMPTY_SYMBOL);
    machine.addTransition(state2, state3, 'b');
    machine.setStartState(state0);
    machine.setFinalState(state3);

    let regex = new RE('ab');
    testConvertRE(convertToNFA(regex), machine, true);

    regex = new RE('(ab)');
    testConvertRE(convertToNFA(regex), machine, true);
});

// RE of simple kleene star "a" + KLEENE + "" (including within parenthesis "(a" + KLEENE + ")" and (a)" + KLEENE + ")
describe('Converting RE - "a' + KLEENE + '"', () => 
{
    let machine = new FSA(false);
    const state0 = machine.createState('q0');
    const state1 = machine.createState('q1');
    const state2 = machine.createState('q2');
    const state3 = machine.createState('q3');
    machine.addTransition(state0, state1, EMPTY_SYMBOL);
    machine.addTransition(state1, state2, 'a');
    machine.addTransition(state2, state3, EMPTY_SYMBOL);
    machine.addTransition(state2, state1, EMPTY_SYMBOL);
    machine.addTransition(state0, state3, EMPTY_SYMBOL);
    machine.setStartState(state0);
    machine.setFinalState(state3);

    let regex = new RE('a' + KLEENE);
    testConvertRE(convertToNFA(regex), machine, true);

    regex = new RE('(a' + KLEENE + ')');
    testConvertRE(convertToNFA(regex), machine, true);

    regex = new RE('(a)' + KLEENE);
    testConvertRE(convertToNFA(regex), machine, true);
});

// Chain of concats "abc"
describe('Converting RE - "abc"', () => 
{
    let machine = new FSA(false);
    const state0 = machine.createState('q0');
    const state1 = machine.createState('q1');
    const state2 = machine.createState('q2');
    const state3 = machine.createState('q3');
    const state4 = machine.createState('q4');
    const state5 = machine.createState('q5');
    machine.addTransition(state0, state1, 'a');
    machine.addTransition(state1, state2, EMPTY_SYMBOL);
    machine.addTransition(state2, state3, 'b');
    machine.addTransition(state3, state4, EMPTY_SYMBOL);
    machine.addTransition(state4, state5, 'c');
    machine.setStartState(state0);
    machine.setFinalState(state5);

    let regex = new RE('abc');
    testConvertRE(convertToNFA(regex), machine, true);
});

// Chain of unions "a" + UNION + "b" + UNION + "c"
describe('Converting RE - "a' + UNION + 'b' + UNION + 'c"', () => 
{
    let machine = new FSA(false);
    const state0 = machine.createState('q0');
    const state1 = machine.createState('q1');
    const state2 = machine.createState('q2');
    const state3 = machine.createState('q3');
    const state4 = machine.createState('q4');
    const state5 = machine.createState('q5');
    const state6 = machine.createState('q6');
    const state7 = machine.createState('q7');
    const state8 = machine.createState('q8');
    const state9 = machine.createState('q9');
    machine.addTransition(state0, state1, EMPTY_SYMBOL);
    machine.addTransition(state0, state7, EMPTY_SYMBOL);
    machine.addTransition(state1, state2, EMPTY_SYMBOL);
    machine.addTransition(state1, state4, EMPTY_SYMBOL);
    machine.addTransition(state2, state3, 'a');
    machine.addTransition(state3, state6, EMPTY_SYMBOL);
    machine.addTransition(state4, state5, 'b');
    machine.addTransition(state5, state6, EMPTY_SYMBOL);
    machine.addTransition(state6, state9, EMPTY_SYMBOL);
    machine.addTransition(state7, state8, 'c');
    machine.addTransition(state8, state9, EMPTY_SYMBOL);
    machine.setStartState(state0);
    machine.setFinalState(state9);

    let regex = new RE('a' + UNION + 'b' + UNION + 'c');
    testConvertRE(convertToNFA(regex), machine, true);
});

// Mix of union and concat to test that concat has higher precedence
describe('Converting RE - "ab' + UNION + 'c" and "a' + UNION + 'bc"', () => 
{
    let machine = new FSA(false);
    let state0 = machine.createState('q0');
    let state1 = machine.createState('q1');
    let state2 = machine.createState('q2');
    let state3 = machine.createState('q3');
    let state4 = machine.createState('q4');
    let state5 = machine.createState('q5');
    let state6 = machine.createState('q6');
    let state7 = machine.createState('q7');
    machine.addTransition(state0, state1, EMPTY_SYMBOL);
    machine.addTransition(state0, state5, EMPTY_SYMBOL);
    machine.addTransition(state1, state2, 'a');
    machine.addTransition(state2, state3, EMPTY_SYMBOL);
    machine.addTransition(state3, state4, 'b');
    machine.addTransition(state4, state7, EMPTY_SYMBOL);
    machine.addTransition(state5, state6, 'c');
    machine.addTransition(state6, state7, EMPTY_SYMBOL);
    machine.setStartState(state0);
    machine.setFinalState(state7);

    let regex = new RE('ab' + UNION + 'c');
    testConvertRE(convertToNFA(regex), machine, true);

    machine = new FSA(false);
    state0 = machine.createState('q0');
    state1 = machine.createState('q1');
    state2 = machine.createState('q2');
    state3 = machine.createState('q3');
    state4 = machine.createState('q4');
    state5 = machine.createState('q5');
    state6 = machine.createState('q6');
    state7 = machine.createState('q7');
    machine.addTransition(state0, state1, EMPTY_SYMBOL);
    machine.addTransition(state0, state3, EMPTY_SYMBOL);
    machine.addTransition(state1, state2, 'a');
    machine.addTransition(state2, state7, EMPTY_SYMBOL);
    machine.addTransition(state3, state4, 'b');
    machine.addTransition(state4, state5, EMPTY_SYMBOL);
    machine.addTransition(state5, state6, 'c');
    machine.addTransition(state6, state7, EMPTY_SYMBOL);
    machine.setStartState(state0);
    machine.setFinalState(state7);

    regex = new RE('a' + UNION + 'bc');
    testConvertRE(convertToNFA(regex), machine, true);
});


// Mix of union and kleene star
describe('Converting RE - "a' + UNION + 'b' + KLEENE + '" and "(a' + UNION + 'b)' + KLEENE + '"', () => 
{
    let machine = new FSA(false);
    let state0 = machine.createState('q0');
    let state1 = machine.createState('q1');
    let state2 = machine.createState('q2');
    let state3 = machine.createState('q3');
    let state4 = machine.createState('q4');
    let state5 = machine.createState('q5');
    let state6 = machine.createState('q6');
    let state7 = machine.createState('q7');
    machine.addTransition(state0, state1, EMPTY_SYMBOL);
    machine.addTransition(state0, state3, EMPTY_SYMBOL);
    machine.addTransition(state1, state2, 'a');
    machine.addTransition(state2, state7, EMPTY_SYMBOL);
    machine.addTransition(state3, state4, EMPTY_SYMBOL);
    machine.addTransition(state3, state6, EMPTY_SYMBOL);
    machine.addTransition(state4, state5, 'b');
    machine.addTransition(state5, state4, EMPTY_SYMBOL);
    machine.addTransition(state5, state6, EMPTY_SYMBOL);
    machine.addTransition(state6, state7, EMPTY_SYMBOL);
    machine.setStartState(state0);
    machine.setFinalState(state7);

    let regex = new RE('a' + UNION + 'b' + KLEENE);
    testConvertRE(convertToNFA(regex), machine, true);

    machine = new FSA(false);
    state0 = machine.createState('q0');
    state1 = machine.createState('q1');
    state2 = machine.createState('q2');
    state3 = machine.createState('q3');
    state4 = machine.createState('q4');
    state5 = machine.createState('q5');
    state6 = machine.createState('q6');
    state7 = machine.createState('q7');
    machine.addTransition(state0, state1, EMPTY_SYMBOL);
    machine.addTransition(state0, state7, EMPTY_SYMBOL);
    machine.addTransition(state1, state2, EMPTY_SYMBOL);
    machine.addTransition(state1, state4, EMPTY_SYMBOL);
    machine.addTransition(state2, state3, 'a');
    machine.addTransition(state3, state6, EMPTY_SYMBOL);
    machine.addTransition(state4, state5, 'b');
    machine.addTransition(state5, state6, EMPTY_SYMBOL);
    machine.addTransition(state6, state7, EMPTY_SYMBOL);
    machine.addTransition(state6, state1, EMPTY_SYMBOL);
    machine.setStartState(state0);
    machine.setFinalState(state7);

    regex = new RE('(a' + UNION + 'b)' + KLEENE);
    testConvertRE(convertToNFA(regex), machine, true);
});


// Mix of concat and kleene star
describe('Converting RE - "ab' + KLEENE + '" and "(ab)' + KLEENE + '"', () => 
{
    let machine = new FSA(false);
    let state0 = machine.createState('q0');
    let state1 = machine.createState('q1');
    let state2 = machine.createState('q2');
    let state3 = machine.createState('q3');
    let state4 = machine.createState('q4');
    let state5 = machine.createState('q5');
    machine.addTransition(state0, state1, 'a');
    machine.addTransition(state1, state2, EMPTY_SYMBOL);
    machine.addTransition(state2, state5, EMPTY_SYMBOL);
    machine.addTransition(state2, state3, EMPTY_SYMBOL);
    machine.addTransition(state3, state4, 'b');
    machine.addTransition(state4, state5, EMPTY_SYMBOL);
    machine.addTransition(state4, state3, EMPTY_SYMBOL);
    machine.setStartState(state0);
    machine.setFinalState(state5);

    let regex = new RE('ab' + KLEENE);
    testConvertRE(convertToNFA(regex), machine, true);

    machine = new FSA(false);
    state0 = machine.createState('q0');
    state1 = machine.createState('q1');
    state2 = machine.createState('q2');
    state3 = machine.createState('q3');
    state4 = machine.createState('q4');
    state5 = machine.createState('q5');
    machine.addTransition(state0, state1, EMPTY_SYMBOL);
    machine.addTransition(state0, state5, EMPTY_SYMBOL);
    machine.addTransition(state1, state2, 'a');
    machine.addTransition(state2, state3, EMPTY_SYMBOL);
    machine.addTransition(state3, state4, 'b');
    machine.addTransition(state4, state1, EMPTY_SYMBOL);
    machine.addTransition(state4, state5, EMPTY_SYMBOL);
    machine.setStartState(state0);
    machine.setFinalState(state5);

    regex = new RE('(ab)' + KLEENE);
    testConvertRE(convertToNFA(regex), machine, true);
});


// Mix of union, concat, and kleene "(a" + UNION + "bc)" + KLEENE + ""
describe('Converting RE - "(a' + UNION + 'bc)' + KLEENE + '"', () => 
{
    let machine = new FSA(false);
    const state0 = machine.createState('q0');
    const state1 = machine.createState('q1');
    const state2 = machine.createState('q2');
    const state3 = machine.createState('q3');
    const state4 = machine.createState('q4');
    const state5 = machine.createState('q5');
    const state6 = machine.createState('q6');
    const state7 = machine.createState('q7');
    const state8 = machine.createState('q8');
    const state9 = machine.createState('q9');
    machine.addTransition(state0, state1, EMPTY_SYMBOL);
    machine.addTransition(state0, state9, EMPTY_SYMBOL);
    machine.addTransition(state1, state2, EMPTY_SYMBOL);
    machine.addTransition(state1, state4, EMPTY_SYMBOL);
    machine.addTransition(state2, state3, 'a');
    machine.addTransition(state3, state8, EMPTY_SYMBOL);
    machine.addTransition(state4, state5, 'b');
    machine.addTransition(state5, state6, EMPTY_SYMBOL);
    machine.addTransition(state6, state7, 'c');
    machine.addTransition(state7, state8, EMPTY_SYMBOL);
    machine.addTransition(state8, state9, EMPTY_SYMBOL);
    machine.addTransition(state8, state1, EMPTY_SYMBOL);
    machine.setStartState(state0);
    machine.setFinalState(state9);

    let regex = new RE('(a' + UNION + 'bc)' + KLEENE);
    testConvertRE(convertToNFA(regex), machine, true);
});


// THE ULTIMATE TEST!
describe('Converting RE - "(ab' + UNION + '(a' + UNION + 'bc)' + KLEENE + 'c' + KLEENE + ')' + KLEENE + '"', () => 
{
    let machine = new FSA(false);
    const state0 = machine.createState('q0');
    const state1 = machine.createState('q1');
    const state2 = machine.createState('q2');
    const state3 = machine.createState('q3');
    const state4 = machine.createState('q4');
    const state5 = machine.createState('q5');
    const state6 = machine.createState('q6');
    const state7 = machine.createState('q7');
    const state8 = machine.createState('q8');
    const state9 = machine.createState('q9');
    const state10 = machine.createState('q10');
    const state11 = machine.createState('q11');
    const state12 = machine.createState('q12');
    const state13 = machine.createState('q13');
    const state14 = machine.createState('q14');
    const state15 = machine.createState('q15');
    const state16 = machine.createState('q16');
    const state17 = machine.createState('q17');
    const state18 = machine.createState('q18');
    const state19 = machine.createState('q19');
    const state20 = machine.createState('q20');
    const state21 = machine.createState('q21');
    machine.addTransition(state0, state1, EMPTY_SYMBOL);
    machine.addTransition(state0, state21, EMPTY_SYMBOL);
    machine.addTransition(state1, state2, EMPTY_SYMBOL);
    machine.addTransition(state1, state6, EMPTY_SYMBOL);
    machine.addTransition(state2, state3, 'a');
    machine.addTransition(state3, state4, EMPTY_SYMBOL);
    machine.addTransition(state4, state5, 'b');
    machine.addTransition(state5, state20, EMPTY_SYMBOL);
    machine.addTransition(state6, state7, EMPTY_SYMBOL);
    machine.addTransition(state6, state15, EMPTY_SYMBOL);
    machine.addTransition(state7, state8, EMPTY_SYMBOL);
    machine.addTransition(state7, state10, EMPTY_SYMBOL);
    machine.addTransition(state8, state9, 'a');
    machine.addTransition(state9, state14, EMPTY_SYMBOL);
    machine.addTransition(state10, state11, 'b');
    machine.addTransition(state11, state12, EMPTY_SYMBOL);
    machine.addTransition(state12, state13, 'c');
    machine.addTransition(state13, state14, EMPTY_SYMBOL);
    machine.addTransition(state14, state7, EMPTY_SYMBOL);
    machine.addTransition(state14, state15, EMPTY_SYMBOL);
    machine.addTransition(state15, state16, EMPTY_SYMBOL);
    machine.addTransition(state16, state19, EMPTY_SYMBOL);
    machine.addTransition(state16, state17, EMPTY_SYMBOL);
    machine.addTransition(state17, state18, 'c');
    machine.addTransition(state18, state17, EMPTY_SYMBOL);
    machine.addTransition(state18, state19, EMPTY_SYMBOL);
    machine.addTransition(state19, state20, EMPTY_SYMBOL);
    machine.addTransition(state20, state1, EMPTY_SYMBOL);
    machine.addTransition(state20, state21, EMPTY_SYMBOL);
    machine.addTransition(state0, state21, EMPTY_SYMBOL);
    machine.setStartState(state0);
    machine.setFinalState(state21);

    let regex = new RE('(ab' + UNION + '(a' + UNION + 'bc)' + KLEENE + 'c' + KLEENE + ')' + KLEENE);
    testConvertRE(convertToNFA(regex), machine, true);
});
