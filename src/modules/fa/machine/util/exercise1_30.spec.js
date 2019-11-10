import FSA from '../FSA.js';
import { solveFSA } from '../FSAUtils.js';

function createTestMachine()
{
    const nfa = new FSA(false);

    // Build nfa...
    // Example 1_30
    const q1 = nfa.createState('q1');
    const q2 = nfa.createState('q2');
    const q3 = nfa.createState('q3');
    const q4 = nfa.createState('q4');

    nfa.addTransition(q1, q1, '0');
    nfa.addTransition(q1, q1, '1');

    nfa.addTransition(q1, q2, '1');
    nfa.addTransition(q2, q3, '0');
    nfa.addTransition(q2, q3, '1');
    nfa.addTransition(q3, q4, '0');
    nfa.addTransition(q3, q4, '1');
    nfa.setFinalState(q4);

    return nfa;
}

describe('Example 1.30', () =>
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

    test('accepts \'000100\'', () =>
    {
        let newNFA = createTestMachine();
        expect(solveFSA(newNFA, '000100')).toBe(true);
    });
    test('accepts \'0011\'', () =>
    {
        let newNFA = createTestMachine();
        expect(solveFSA(newNFA, '0011')).toBe(false);
    });
});
