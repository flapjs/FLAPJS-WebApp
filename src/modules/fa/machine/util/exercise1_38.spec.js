import FSA, { EMPTY_SYMBOL } from '../FSA.js';
import { solveFSA } from '../FSAUtils.js';

function createTestMachine()
{
    const nfa = new FSA(false);

    // Build nfa...
    // Example 1_38
    const q1 = nfa.createState('q1');
    const q2 = nfa.createState('q2');
    const q3 = nfa.createState('q3');
    const q4 = nfa.createState('q4');

    nfa.addTransition(q1, q1, '1');
    nfa.addTransition(q1, q1, '0');
    nfa.addTransition(q1, q2, '1');
    nfa.addTransition(q2, q3, '0');
    nfa.addTransition(q2, q3, EMPTY_SYMBOL);
    nfa.addTransition(q3, q4, '1');
    nfa.addTransition(q4, q4, '0');
    nfa.addTransition(q4, q4, '1');
    nfa.setFinalState(q4);

    return nfa;
}

describe('Example 1.38', () =>
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

    test('accepts \'0001111111111\'', () =>
    {
        let newNFA = createTestMachine();
        expect(solveFSA(newNFA, '0001111111111')).toBe(true);
    });
    test('accepts \'00011111111110001\'', () =>
    {
        let newNFA = createTestMachine();
        expect(solveFSA(newNFA, '00011111111110001')).toBe(true);
    });
});
