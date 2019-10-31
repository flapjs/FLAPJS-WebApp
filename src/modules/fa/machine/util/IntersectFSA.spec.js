import FSA from '../FSA.js';
import { intersectDFA } from '../FSAUtils.js';

describe('Trying to intersect empty DFA machines', () =>
{
    const dfa1 = new FSA(true);
    const dfa2 = new FSA(true);
    const intersected = intersectDFA(dfa1, dfa2);

    test('is a valid empty DFA machine', () =>
    {
        expect(intersected.isDeterministic()).toBe(true);
        expect(intersected.validate()).toBe(true);
        expect(intersected.getStateCount()).toBe(0);
    });
});

describe('Trying to intersect single-state DFA machines', () =>
{
    const dfa1 = new FSA(true);
    const dfa2 = new FSA(true);
    const state0 = dfa1.createState('q0');
    dfa1.addTransition(state0, state0, '0');

    const state1 = dfa2.createState('q1');
    dfa2.addTransition(state1, state1, '0');

    const result = intersectDFA(dfa1, dfa2);
    test('is valid intersected machine', () =>
    {
        expect(result.validate()).toBe(true);
        expect(result.isValid()).toBe(true);

        const states = result.getStatesByLabel('(q0,q1)');
        expect(states).toBeDefined();
        expect(states).toHaveLength(1);

        const state01 = states[0];
        expect(result.hasTransition(state01, state01, '0'));
    });
});

describe('Trying to intersect different alphabet machines', () =>
{
    const dfa1 = new FSA(true);
    const dfa2 = new FSA(true);
    const state0 = dfa1.createState('q0');
    dfa1.addTransition(state0, state0, '0');
    const state1 = dfa2.createState('q1');
    dfa2.addTransition(state1, state1, '1');

    test('to throw for invalid alphabet match', () =>
    {
        expect(() => intersectDFA(dfa1, dfa2)).toThrow();
    });
});
