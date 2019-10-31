import FSA, { EMPTY_SYMBOL } from '../FSA.js';
import { solveFSA, solveFSAByStep } from '../FSAUtils.js';

function testSolveFSA(machine, testString, expectedResult = true)
{
    test('test string \'' + testString + '\'', () =>
    {
        expect(solveFSA(machine, testString)).toBe(expectedResult);
    });
}

describe('Testing DFA machine: \'1*\'', () =>
{
    const machine = new FSA(true);
    const state0 = machine.createState('q0');
    const state1 = machine.createState('q1');
    machine.addTransition(state0, state1, '0');
    machine.addTransition(state0, state0, '1');
    machine.addTransition(state1, state1, '0');
    machine.addTransition(state1, state1, '1');
    machine.setStartState(state0);
    machine.setFinalState(state0);

    test('is a DFA machine type (not necessarily valid)', () =>
    {
        expect(machine.isDeterministic()).toBe(true);
    });
    test('is a valid DFA machine', () =>
    {
        expect(machine.validate()).toBe(true);
        expect(machine.isValid()).toBe(true);
    });
    test('machine accepts the empty string since start state is also final', () =>
    {
        expect(solveFSA(machine, '')).toBe(true);
    });

    //Test strings
    testSolveFSA(machine, '0', false);
    testSolveFSA(machine, '1', true);
    testSolveFSA(machine, '011111', false);
    testSolveFSA(machine, '11010101', false);
    testSolveFSA(machine, '1111', true);
});

describe('Testing DFA-like NFA machine: \'1*\'', () =>
{
    const machine = new FSA(false);
    const state0 = machine.createState('q0');
    const state1 = machine.createState('q1');
    machine.addTransition(state0, state1, '0');
    machine.addTransition(state0, state0, '1');
    machine.addTransition(state1, state1, '0');
    machine.addTransition(state1, state1, '1');
    machine.setStartState(state0);
    machine.setFinalState(state0);

    test('is a NFA machine type', () =>
    {
        expect(machine.isDeterministic()).toBe(false);
    });
    test('is a valid NFA machine', () =>
    {
        expect(machine.validate()).toBe(true);
        expect(machine.isValid()).toBe(true);
    });

    //Test strings
    testSolveFSA(machine, '', true);
    testSolveFSA(machine, '0', false);
    testSolveFSA(machine, '1', true);
    testSolveFSA(machine, '011111', false);
    testSolveFSA(machine, '11010101', false);
    testSolveFSA(machine, '1111', true);
});

describe('Testing NFA machine with immediate transitions', () =>
{
    const machine = new FSA();
    const state0 = machine.createState('q0');
    const state1 = machine.createState('q1');
    const state2 = machine.createState('q2');
    machine.addTransition(state0, state1, '0');
    machine.addTransition(state0, state2, '1');
    machine.addTransition(state1, state2, EMPTY_SYMBOL);
    machine.addTransition(state1, state0, EMPTY_SYMBOL);
    machine.addTransition(state1, state1, '0');
    machine.addTransition(state1, state1, '1');
    machine.setStartState(state0);
    machine.setFinalState(state2);

    test('is a NFA machine type', () =>
    {
        expect(machine.isDeterministic()).toBe(false);
    });
    test('is a valid NFA machine', () =>
    {
        expect(machine.validate()).toBe(true);
        expect(machine.isValid()).toBe(true);
    });

    //Test strings
    testSolveFSA(machine, '', false);
    testSolveFSA(machine, '0', true);
    testSolveFSA(machine, '1', true);
    testSolveFSA(machine, '011111', true);
    testSolveFSA(machine, '11010101', false);
    testSolveFSA(machine, '1111', false);
});

describe('Testing NFA machine step by step', () =>
{
    const machine = new FSA();
    const state0 = machine.createState('q0');
    const state1 = machine.createState('q1');
    const state2 = machine.createState('q2');
    machine.addTransition(state0, state1, '0');
    machine.addTransition(state0, state2, '1');
    machine.setFinalState(state2);

    test('test string \'0\'', () =>
    {
        const cachedStates = [];
        const cachedSymbols = [];
        const startState = machine.getStartState();
        for (const currentState of machine.doClosureTransition(startState))
        {
            cachedStates.push({ state: currentState, index: 0 });
        }

        expect(startState.getStateLabel()).toBe('q0');
        expect(cachedStates).toHaveLength(1);
        expect(cachedStates[0].state.getStateLabel()).toBe('q0');

        let result = solveFSAByStep(machine, '0', cachedStates, cachedSymbols);

        expect(result).toBe(false);
        expect(cachedStates).toHaveLength(1);
        expect(cachedStates[0].state.getStateLabel()).toBe('q1');

        result = solveFSAByStep(machine, null, cachedStates, cachedSymbols);

        expect(result).toBe(false);
        expect(cachedStates).toHaveLength(0);
    });

    test('test string \'1\'', () =>
    {
        const cachedStates = [];
        const cachedSymbols = [];
        const startState = machine.getStartState();
        for (const currentState of machine.doClosureTransition(startState))
        {
            cachedStates.push({ state: currentState, index: 0 });
        }

        expect(startState.getStateLabel()).toBe('q0');
        expect(cachedStates).toHaveLength(1);
        expect(cachedStates[0].state.getStateLabel()).toBe('q0');

        let result = solveFSAByStep(machine, '1', cachedStates, cachedSymbols);

        expect(result).toBe(false);
        expect(cachedStates).toHaveLength(1);
        expect(cachedStates[0].state.getStateLabel()).toBe('q2');

        result = solveFSAByStep(machine, null, cachedStates, cachedSymbols);

        expect(result).toBe(true);
        expect(cachedStates).toHaveLength(1);
        expect(cachedStates[0].state.getStateLabel()).toBe('q2');
    });
});
