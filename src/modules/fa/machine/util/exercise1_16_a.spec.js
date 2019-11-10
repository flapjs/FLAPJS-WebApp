import FSA from '../FSA.js';
import { solveFSA } from '../FSAUtils.js';

function createTestMachine()
{
    const nfa = new FSA(false);

    // Build NFA...
    // Example 1_16_a
    const q1 = nfa.createState('q1');
    const q2 = nfa.createState('q2');
    nfa.addTransition(q1,q1,'a');
    nfa.addTransition(q1,q2,'a');
    nfa.addTransition(q1,q2,'b');
    nfa.addTransition(q2,q1,'b');
    nfa.setFinalState(q1);

    return nfa;
}

describe('Exercise 1.16.a', () =>
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
        expect(nfa.getStartState().getStateLabel()).toBe('q1');
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
