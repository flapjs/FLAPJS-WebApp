import FSA, { EMPTY_SYMBOL } from '../FSA.js';
import { solveFSA, convertToDFA } from '../FSAUtils.js';

function testSolveFSA(machine, testString, expectedResult = true)
{
    test('test string \'' + testString + '\'', () =>
    {
        expect(solveFSA(machine, testString)).toBe(expectedResult);
    });
}

describe('Trying to convert an empty NFA machine', () =>
{
    const nfa = new FSA(false);
    const dfa = convertToDFA(nfa, nfa);

    test('is a valid empty DFA', () =>
    {
        expect(dfa).toBeDefined();
        expect(dfa.validate()).toBe(true);
        expect(dfa.isValid()).toBe(true);
    });
});

describe('Trying to convert a simple state machine', () =>
{
    const nfa = new FSA(false);
    const state0 = nfa.createState('q0');
    nfa.addTransition(state0, state0, '0');
    nfa.addTransition(state0, state0, '1');
    const dfa = convertToDFA(nfa, nfa);

    test('trap state exists', () =>
    {
        const trapStates = nfa.getStatesByLabel('{}');
        expect(trapStates).toBeDefined();
        expect(trapStates).toHaveLength(1);
    });

    test('is valid DFA machine', () =>
    {
        expect(dfa).toBeDefined();
        expect(dfa.validate()).toBe(true);
        expect(dfa.isValid()).toBe(true);
    });

    test('has the expected generated states', () =>
    {
        const states = Array.from(dfa.getStates());
        expect(states).toHaveLength(2);
        expect(dfa.hasStateWithLabel('{q0}')).toBe(true);
    });

    test('has the expected alphabet', () =>
    {
        const alphabet = dfa.getAlphabet();
        expect(alphabet).toHaveLength(2);
        expect(alphabet).toContain('0');
        expect(alphabet).toContain('1');
    });

    test('has the expected transitions', () =>
    {
        let q0 = dfa.getStatesByLabel('{q0}');
        expect(q0).toHaveLength(1);
        q0 = q0[0];
        expect(q0).toBeDefined();

        let result = dfa.doTransition(q0, '0');
        expect(result).toHaveLength(1);
        expect(result[0].getStateLabel()).toBe('{q0}');

        result = dfa.doTransition(q0, '1');
        expect(result).toHaveLength(1);
        expect(result[0].getStateLabel()).toBe('{q0}');
    });
});

describe('Trying recursive test', () =>
{
    const machine = new FSA();
    const state0 = machine.createState('q0');
    const state1 = machine.createState('q1');
    machine.addTransition(state0, state1, '1');
    machine.addTransition(state1, state0, '0');
    machine.setStartState(state0);
    machine.setFinalState(state0);

    const result = convertToDFA(machine, machine);
    test('is a valid DFA machine', () =>
    {
        expect(result).toBeDefined();
        expect(result.validate()).toBe(true);
        expect(result.isValid()).toBe(true);
    });
});

describe('Trying another machine', () =>
{
    const nfa = new FSA(false);
    const state0 = nfa.createState('q0');
    const state1 = nfa.createState('q1');
    nfa.addTransition(state0, state0, '0');
    nfa.addTransition(state0, state0, '1');
    nfa.addTransition(state0, state1, '1');
    nfa.setFinalState(state1);

    const result = convertToDFA(nfa, nfa);
    test('is a valid DFA', () =>
    {
        expect(result).toBeDefined();
        expect(result.validate()).toBe(true);
        expect(result.isValid()).toBe(true);
    });

    // const states = result.getStates();
    //console.log(states, result.getStartState(), result.getFinalStates());
    // const alphabet = result.getAlphabet();
    //console.log(alphabet);
    // const transitions = result.getTransitions();
    //console.log(transitions);

    testSolveFSA(result, '', false);
    testSolveFSA(result, '0', false);
    testSolveFSA(result, '1', true);
    testSolveFSA(result, '111111111111', true);
    testSolveFSA(result, '10000000001', true);
    testSolveFSA(result, '0000000001', true);
    testSolveFSA(result, '101010010010100101', true);
});

describe('Trying a machine with immediate moves', () =>
{
    const nfa = new FSA(false);
    const state0 = nfa.createState('q0');
    const state1 = nfa.createState('q1');
    nfa.addTransition(state0, state0, '0');
    nfa.addTransition(state0, state0, '1');
    nfa.addTransition(state0, state1, '1');
    nfa.addTransition(state0, state1, EMPTY_SYMBOL);
    nfa.setFinalState(state1);

    const result = convertToDFA(nfa, nfa);

    test('is a valid DFA', () =>
    {
        expect(result).toBeDefined();
        expect(result.validate()).toBe(true);
        expect(result.isValid()).toBe(true);
    });

    /*
    const states = result.getStates();
    //console.log(states, result.getStartState(), result.getFinalStates());
    const alphabet = result.getAlphabet();
    //console.log(alphabet);
    const transitions = result.getTransitions();
    //console.log(transitions);
    */

    testSolveFSA(result, '', true);
    testSolveFSA(result, '0', true);
    testSolveFSA(result, '1', true);
    testSolveFSA(result, '111111111111', true);
    testSolveFSA(result, '10000000001', true);
    testSolveFSA(result, '0000000001', true);
    testSolveFSA(result, '101010010010100101', true);
});
