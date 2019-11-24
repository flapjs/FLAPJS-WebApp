import FSA from '../FSA.js';
import { solveFSA } from '../FSAUtils.js';

function createTestMachine()
{
    const dfa = new FSA(true);

    // Build DFA...
    // Example 1_11
    const s = dfa.createState('s');
    const q1 = dfa.createState('q1');
    const q2 = dfa.createState('q2');
    const r1 = dfa.createState('r1');
    const r2 = dfa.createState('r2');

    dfa.addTransition(s, q1, 'a');
    dfa.addTransition(q1, q1, 'a');
    dfa.addTransition(q1, q2, 'b');
    dfa.addTransition(q2, q2, 'b');
    dfa.addTransition(q2, q1, 'a');
    dfa.addTransition(s, r1, 'b');
    dfa.addTransition(r1, r1, 'b');
    dfa.addTransition(r1, r2, 'a');
    dfa.addTransition(r2, r2, 'a');
    dfa.addTransition(r2, r1, 'b');
    dfa.setFinalState(q1);
    dfa.setFinalState(r1);

    return dfa;
}

describe('Example 1.11', () =>
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
        expect(dfa.getStartState().getStateLabel()).toBe('s');
    });

    test('accepts \'aaaaaabbbbbbba\'', () =>
    {
        let newDFA = createTestMachine();
        expect(solveFSA(newDFA, 'aaaaaabbbbbbba')).toBe(true);
    });
    test('accepts \'bbbbbbbbaaaaaab\'', () =>
    {
        let newDFA = createTestMachine();
        expect(solveFSA(newDFA, 'bbbbbbbbaaaaaab')).toBe(true);
    });
});
