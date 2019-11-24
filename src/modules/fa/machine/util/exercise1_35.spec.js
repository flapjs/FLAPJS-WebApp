import FSA, { EMPTY_SYMBOL } from '../FSA.js';
import { solveFSA } from '../FSAUtils.js';

function createTestMachine()
{
    const nfa = new FSA(false);

    // Build nfa...
    // Example 1_35
    const q1 = nfa.createState('q1');
    const q2 = nfa.createState('q2');
    const q3 = nfa.createState('q3');


    nfa.addTransition(q1, q2, 'b');
    nfa.addTransition(q2, q2, 'a');
    nfa.addTransition(q2, q3, 'a');
    nfa.addTransition(q2, q3, 'b');
    nfa.addTransition(q3, q1, 'a');
    nfa.addTransition(q1, q3, EMPTY_SYMBOL);
    nfa.setFinalState(q1);

    return nfa;
}

describe('Example 1.35', () =>
{
    const nfa = createTestMachine();
    test('is a valid nfa', () =>
    {
        expect(nfa).toBeDefined();
        expect(nfa.validate()).toBe(true);
        expect(nfa.isValid()).toBe(true);
    });

    test('has correct start state', () =>
    {
        expect(nfa.getStartState().getStateLabel()).toBe('q1');
    });

    test('accepts \'aaaabba\'', () =>
    {
        let newNFA = createTestMachine();
        expect(solveFSA(newNFA, 'aaaabba')).toBe(true);
    });
    test('accepts \'bba\'', () =>
    {
        let newNFA = createTestMachine();
        expect(solveFSA(newNFA, 'bba')).toBe(true);
    });
});
