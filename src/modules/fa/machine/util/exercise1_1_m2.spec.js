import FSA from '../FSA.js';
import { solveFSA } from '../FSAUtils.js';

function createTestMachine()
{
    const dfa = new FSA(true);

    // Build DFA...
    const q1 = dfa.createState('q1');
    const q2 = dfa.createState('q2');
    const q3 = dfa.createState('q3');
    const q4 = dfa.createState('q4');
    dfa.addTransition(q1, q1, 'a');
    dfa.addTransition(q1, q2, 'b');
    dfa.addTransition(q2, q3, 'a');
    dfa.addTransition(q3, q2, 'a');
    dfa.addTransition(q2, q4, 'b');
    dfa.addTransition(q4, q4, 'b');
    dfa.addTransition(q4, q3, 'a');
    dfa.addTransition(q3, q1, 'b');
    dfa.setFinalState(q2);

    return dfa;
}

describe('Exercise 1.1 - M1', () =>
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
        expect(dfa.getStartState().getStateLabel()).toBe('q1');
    });

    test('accepts \'a\'', () =>
    {
        let newDFA = createTestMachine();
        expect(solveFSA(newDFA, 'a'));
    });
});
