import FSA from '../FSA.js';
import { invertDFA } from '../FSAUtils.js';

describe('Trying to invert an empty DFA machine', () =>
{
    const dfa = new FSA(true);
    const inverted = invertDFA(dfa, dfa);

    test('is still empty', () =>
    {
        expect(inverted.getStateCount()).toBe(0);
    });
});

describe('Trying to invert a single-state state machine', () =>
{
    const dfa = new FSA(true);
    const state0 = dfa.createState('q0');
    dfa.addTransition(state0, state0, '0');
    const inverted = invertDFA(dfa);

    test('single state still exists', () =>
    {
        const states = inverted.getStatesByLabel('q0');
        expect(states).toBeDefined();
        expect(states).toHaveLength(1);
    });

    test('single state is inverted', () =>
    {
        const oldFinalStates = Array.from(dfa.getFinalStates());
        const newFinalStates = Array.from(inverted.getFinalStates());
        expect(oldFinalStates).toHaveLength(0);
        expect(newFinalStates).toHaveLength(1);
    });
});


describe('Trying to invert a multiple state state machine', () =>
{
    const dfa = new FSA(true);
    const state0 = dfa.createState('q0');
    const state1 = dfa.createState('q1');
    dfa.addTransition(state0, state0, '0');
    dfa.addTransition(state0, state0, '1');
    dfa.addTransition(state1, state0, '0');
    dfa.addTransition(state1, state0, '1');
    dfa.setFinalState(state0, true);

    const inverted = invertDFA(dfa);
    const invFinalStates = Array.from(inverted.getFinalStates());
    const invState0 = inverted.getStateByID(state0.getStateID());
    const invState1 = inverted.getStateByID(state1.getStateID());

    test('has valid final states', () =>
    {
        expect(dfa.isFinalState(state0)).toBe(true);
        expect(dfa.isFinalState(state1)).toBe(false);
    });

    test('has valid inverted final states', () =>
    {
        expect(invFinalStates).toHaveLength(1);
        expect(inverted.isFinalState(invState0)).toBe(false);
        expect(inverted.isFinalState(invState1)).toBe(true);
    });

    test('still has the same transitions', () =>
    {
        expect(inverted.hasTransition(invState0, invState0, '0')).toBe(true);
        expect(inverted.hasTransition(invState0, invState0, '1')).toBe(true);
        expect(inverted.hasTransition(invState1, invState0, '0')).toBe(true);
        expect(inverted.hasTransition(invState1, invState0, '1')).toBe(true);
    });

    test('didn\'t add more transitions', () =>
    {
        expect(inverted.hasTransition(invState0, invState1, '0')).toBe(false);
        expect(inverted.hasTransition(invState0, invState1, '1')).toBe(false);
        expect(inverted.hasTransition(invState1, invState1, '0')).toBe(false);
        expect(inverted.hasTransition(invState1, invState1, '1')).toBe(false);
    });
});
