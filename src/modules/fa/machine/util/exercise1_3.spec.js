import FSA from '../FSA.js';
import { solveFSA } from '../FSAUtils.js';

function createTestMachine()
{
    const dfa = new FSA(true);

    // Build DFA...
    const q3 = dfa.createState('q3');
    const q1 = dfa.createState('q1');
    const q2 = dfa.createState('q2');
    const q4 = dfa.createState('q4');
    const q5 = dfa.createState('q5');
    dfa.addTransition(q1, q1, 'u');
    dfa.addTransition(q1, q2, 'd');
    dfa.addTransition(q2, q1, 'u');
    dfa.addTransition(q2, q3, 'd');
    dfa.addTransition(q3, q2, 'u');
    dfa.addTransition(q3, q4, 'd');
    dfa.addTransition(q4, q3, 'u');
    dfa.addTransition(q4, q5, 'd');
    dfa.addTransition(q5, q4, 'u');
    dfa.addTransition(q5, q5, 'd');
    dfa.setFinalState(q3);

    return dfa;
}

describe('Exercise 1.3', () =>
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
        expect(dfa.getStartState().getStateLabel()).toBe('q3');
    });

    test('accepts \'\'', () =>
    {
        let newDFA = createTestMachine();
        expect(solveFSA(newDFA, '')).toBe(true);
    });
    test('accepts \'uudd\'', () =>
    {
        let newDFA = createTestMachine();
        expect(solveFSA(newDFA, 'uudd')).toBe(true);
    });
});
