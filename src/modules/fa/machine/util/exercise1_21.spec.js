import FSA from '../FSA.js';
import { solveFSA } from '../FSAUtils.js';

function createTestMachine()
{
    const dfa = new FSA(true);

    // Build DFA...
    // Example 1_21
    const q = dfa.createState('q');
    const q0 = dfa.createState('q0');
    const q00 = dfa.createState('q00');
    const q001 = dfa.createState('q001');

    dfa.addTransition(q, q, '1');
    dfa.addTransition(q, q0, '0');
    dfa.addTransition(q0, q, '1');
    dfa.addTransition(q0, q00, '0');
    dfa.addTransition(q00, q00, '0');
    dfa.addTransition(q00, q001, '1');
    dfa.addTransition(q001, q001, '0');
    dfa.addTransition(q001, q001, '1');
    dfa.setFinalState(q001);

    return dfa;
}

describe('Example 1.21', () =>
{
    const dfa = createTestMachine();
    test('is a valid DFA', () =>
    {
        expect(dfa).toBeDefined();
        expect(dfa.validate()).toBe(true);
        expect(dfa.isValid()).toBe(true);
    });

    test('has correct start state', () =>
    {
        expect(dfa.getStartState().getStateLabel()).toBe('q');
    });

    test('accepts \'111111111001111111111\'', () =>
    {
        let newDFA = createTestMachine();
        expect(solveFSA(newDFA, '111111111001111111111')).toBe(true);
    });
    test('accepts \'01010010110101\'', () =>
    {
        let newDFA = createTestMachine();
        expect(solveFSA(newDFA, '01010010110101')).toBe(true);
    });
});
