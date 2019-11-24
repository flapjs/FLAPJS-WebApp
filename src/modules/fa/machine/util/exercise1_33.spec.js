import FSA, { EMPTY_SYMBOL } from '../FSA.js';
import { solveFSA } from '../FSAUtils.js';

function createTestMachine()
{
    const nfa = new FSA(false);

    // Build nfa...
    // Example 1_33
    const q0 = nfa.createState('q0');
    const q1 = nfa.createState('q1');
    const q2 = nfa.createState('q2');
    const q3 = nfa.createState('q3');
    const q4 = nfa.createState('q4');
    const q5 = nfa.createState('q5');

    nfa.addTransition(q0, q1, EMPTY_SYMBOL);
    nfa.addTransition(q0, q3, EMPTY_SYMBOL);
    nfa.addTransition(q1, q2, '0');
    nfa.addTransition(q2, q1, '0');
    nfa.addTransition(q3, q4, '0');
    nfa.addTransition(q4, q5, '0');
    nfa.addTransition(q5, q3, '0');
    nfa.setFinalState(q1);
    nfa.setFinalState(q3);

    return nfa;
}

describe('Example 1.33', () =>
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
        expect(nfa.getStartState().getStateLabel()).toBe('q0');
    });

    test('accepts \'\'', () =>
    {
        let newNFA = createTestMachine();
        expect(solveFSA(newNFA, '00')).toBe(true);
    });
    test('accepts \'00\'', () =>
    {
        let newNFA = createTestMachine();
        expect(solveFSA(newNFA, '00')).toBe(true);
    });
    test('accepts \'000000000\'', () =>
    {
        let newNFA = createTestMachine();
        expect(solveFSA(newNFA, '000000000')).toBe(true);
    });
});
