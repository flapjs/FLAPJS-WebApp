import FSA from '../FSA.js';
import { solveFSA } from '../FSAUtils.js';

function createTestMachine()
{
    const dfa = new FSA(true);

    // Build DFA...
    // Example 1_13
    const q0 = dfa.createState('q0');
    const q1 = dfa.createState('q1');
    const q2 = dfa.createState('q2');
    const r = 'r'; // <RESET>
    dfa.addTransition(q0, q0, '0');
    dfa.addTransition(q0, q0, r);
    dfa.addTransition(q0, q1, '1');
    dfa.addTransition(q1, q0, '2');
    dfa.addTransition(q1, q0, r);
    dfa.addTransition(q1, q1, '0');
    dfa.addTransition(q1, q2, '1');
    dfa.addTransition(q2, q2, '0');
    dfa.addTransition(q2, q1, '2');
    dfa.addTransition(q2, q0, '1');
    dfa.addTransition(q2, q1, r);
    dfa.addTransition(q0, q2, '2');
    dfa.setFinalState(q0);

    return dfa;
}

describe('Example 1.13 ', () =>
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
        expect(dfa.getStartState().getStateLabel()).toBe('q0');
    });

    test('accepts \'0000000r00\'', () =>
    {
        let newDFA = createTestMachine();
        expect(solveFSA(newDFA, '0000000r00')).toBe(true);
    });
    test('accepts \'r11112r\'', () =>
    {
        let newDFA = createTestMachine();
        expect(solveFSA(newDFA, 'r11112r')).toBe(true);
    });
});
