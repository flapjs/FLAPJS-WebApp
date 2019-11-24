import FSA, { EMPTY_SYMBOL } from '../FSA.js';
import { isEquivalentFSAWithWitness, isEquivalentDFA } from '../FSAUtils.js';
// import { isLanguageNotEmpty } from './EqualFSA.js';

describe('Testing equivalency between empty DFA machines', () =>
{
    const dfa1 = new FSA(true);
    const dfa2 = new FSA(true);
    test('is DFA equivalent', () =>
    {
        const result = isEquivalentDFA(dfa1, dfa2).value;
        expect(result).toBe(true);
    });
    test('is FSA equivalent', () =>
    {
        const result = isEquivalentFSAWithWitness(dfa1, dfa2).value;
        expect(result).toBe(true);
    });
});

describe('Testing equivalency between itself', () =>
{
    const fsa1 = new FSA(true);
    let q0 = fsa1.createState('q0');
    let q1 = fsa1.createState('q1');
    fsa1.setFinalState(q1);
    fsa1.addTransition(q0, q1, '0');

    test('is FSA equivalent', () =>
    {
        const result = isEquivalentFSAWithWitness(fsa1, fsa1).value;
        expect(result).toBe(true);
    });
});

describe('Testing equivalency between non-empty FSA machines', () =>
{
    const fsa1 = new FSA(true);
    let q0 = fsa1.createState('q0');
    let q1 = fsa1.createState('q1');
    fsa1.setFinalState(q1);
    fsa1.addTransition(q0, q1, '0');

    const fsa2 = new FSA(false);
    q0 = fsa2.createState('q0');
    q1 = fsa2.createState('q1');
    fsa2.setFinalState(q1);
    fsa2.addTransition(q0, q1, '0');

    const fsa3 = new FSA(false);
    q0 = fsa3.createState('q0');
    q1 = fsa3.createState('q1');
    fsa3.setFinalState(q1);
    fsa3.addTransition(q0, q1, '1');

    test('is similar FSA equivalent', () =>
    {
        const result = isEquivalentFSAWithWitness(fsa1, fsa2).value;
        expect(result).toBe(true);
    });

    test('is different symbol FSA equivalent', () =>
    {
        const result = isEquivalentFSAWithWitness(fsa1, fsa3).value;
        expect(result).toBe(false);
    });


});

describe('Testing equivalency between FSAs vs Minimized FSAs', () =>
{
    const dfa1 = new FSA(true);
    let q0 = dfa1.createState('q0');
    let q1 = dfa1.createState('q1');
    let q2 = dfa1.createState('q2');
    let q3 = dfa1.createState('q3');
    let q4 = dfa1.createState('q4');
    let q5 = dfa1.createState('q5');
    dfa1.addTransition(q0, q3, '0');
    dfa1.addTransition(q0, q4, '1');
    dfa1.addTransition(q1, q4, '0');
    dfa1.addTransition(q1, q5, '1');
    dfa1.addTransition(q2, q5, '0');
    dfa1.addTransition(q2, q3, '1');
    dfa1.addTransition(q3, q0, '0');
    dfa1.addTransition(q3, q2, '1');
    dfa1.addTransition(q4, q1, '0');
    dfa1.addTransition(q4, q0, '1');
    dfa1.addTransition(q5, q2, '0');
    dfa1.addTransition(q5, q1, '1');
    dfa1.setStartState(q0);
    dfa1.setFinalState(q0);
    dfa1.setFinalState(q3);

    const dfa1min = new FSA(true);
    q0 = dfa1min.createState('q0');
    q1 = dfa1min.createState('q1');
    q2 = dfa1min.createState('q2');
    dfa1min.addTransition(q0, q0, '0');
    dfa1min.addTransition(q0, q1, '1');
    dfa1min.addTransition(q1, q0, '1');
    dfa1min.addTransition(q1, q2, '0');
    dfa1min.addTransition(q2, q1, '0');
    dfa1min.addTransition(q2, q2, '1');
    dfa1min.setStartState(q0);
    dfa1min.setFinalState(q0);

    test('original vs minimized is equivalent', () =>
    {
        const result = isEquivalentFSAWithWitness(dfa1, dfa1min).value;
        expect(result).toBe(true);
    });

    const fsa1 = new FSA(false);
    q0 = fsa1.createState('q0');
    q1 = fsa1.createState('q1');
    q2 = fsa1.createState('q2');
    q3 = fsa1.createState('q3');
    q4 = fsa1.createState('q4');
    q5 = fsa1.createState('q5');
    fsa1.addTransition(q0, q1, 'a');
    fsa1.addTransition(q1, q2, EMPTY_SYMBOL);
    fsa1.addTransition(q2, q3, 'b');
    fsa1.addTransition(q3, q4, EMPTY_SYMBOL);
    fsa1.addTransition(q4, q5, 'c');
    fsa1.setStartState(q0);
    fsa1.setFinalState(q5);

    const fsa1min = new FSA(false);
    q0 = fsa1min.createState('q0');
    q1 = fsa1min.createState('q1');
    q2 = fsa1min.createState('q2');
    q3 = fsa1min.createState('q4');
    fsa1min.addTransition(q0, q1, 'a');
    fsa1min.addTransition(q1, q2, 'b');
    fsa1min.addTransition(q2, q3, 'c');
    fsa1min.setStartState(q0);
    fsa1min.setFinalState(q3);

    test('Minimized is removing excess EMPTY_SYMBOL transitions', () =>
    {
        const result = isEquivalentFSAWithWitness(fsa1, fsa1min).value;
        expect(result).toBe(true);
    });

    const dfa3 = new FSA(true);
    q0 = dfa3.createState('q0');
    q1 = dfa3.createState('q1');
    dfa3.addTransition(q0, q1, '0');
    dfa3.addTransition(q0, q1, '1');
    dfa3.addTransition(q1, q1, '0');
    dfa3.addTransition(q1, q1, '1');
    dfa3.setFinalState(q1);

    /*
    // DEBUG: just to see what the empty language is doing...
    test('see what isLanguage empty is doing.', () => 
    {
        const result = isLanguageNotEmpty(dfa3);
        console.log(result);
    });
    */
});
