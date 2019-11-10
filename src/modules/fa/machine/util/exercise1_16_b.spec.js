import FSA, { EMPTY_SYMBOL } from '../FSA.js';
import { solveFSA } from '../FSAUtils.js';

function createTestMachine()
{
    const nfa = new FSA(false);

    // Build NFA...
    // Example 1_16_b
    const q1 = nfa.createState('1');
    const q2 = nfa.createState('2');
    const q3 = nfa.createState('3');
    nfa.addTransition(q1, q2, EMPTY_SYMBOL);
    nfa.addTransition(q2, q1, 'a');
    nfa.addTransition(q1, q3, 'a');
    nfa.addTransition(q3, q2, 'a');
    nfa.addTransition(q3, q2, 'b');
    nfa.addTransition(q3, q3, 'b');
    nfa.setFinalState(q2);

    return nfa;
}

describe('Exercise 1.16.b', () =>
{
    const nfa = createTestMachine();
    test('is a valid NFA', () =>
    {
        expect(nfa).toBeDefined();
        expect(nfa.validate()).toBe(true);
        expect(nfa.isValid()).toBe(true);
    });

    test('has correct start state', () =>
    {
        expect(nfa.getStartState().getStateLabel()).toBe('1');
    });

    test('accepts \'\'', () =>
    {
        expect(solveFSA(nfa, '')).toBe(true);
    });
    test('accepts \'aaaaaaabbaaaaaabb\'', () =>
    {
        expect(solveFSA(nfa, 'aaaaaaabbaaaaaabb')).toBe(true);
    });
});
