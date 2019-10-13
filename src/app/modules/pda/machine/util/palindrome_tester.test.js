/* eslint-disable quotes */
/* eslint-disable no-undef */
import PDA, { EMPTY_SYMBOL } from '../PDA.js';
import { solvePDA } from '../PDAUtils.js';

function createTestMachine()
{
    const pda = new PDA(true);

    // Build PDA...
    const q0 = pda.createState("q0");
    const q1 = pda.createState("q1");
    const q2 = pda.createState("q2");

    // q0 -> q0 transitions
    pda.addTransition(q0, q0, "a", EMPTY_SYMBOL, "a");
    pda.addTransition(q0, q0, "b", EMPTY_SYMBOL, "b");
    pda.addTransition(q0, q0, "c", EMPTY_SYMBOL, "c");
    pda.addTransition(q0, q0, EMPTY_SYMBOL, EMPTY_SYMBOL, "#");

    //q0 -> q1 spontaneous transition
    pda.addTransition(q0, q1, EMPTY_SYMBOL, EMPTY_SYMBOL, EMPTY_SYMBOL);

    //q1 -> q1 transtions
    pda.addTransition(q1, q1, "a", "a", EMPTY_SYMBOL);
    pda.addTransition(q1, q1, "b", "b", EMPTY_SYMBOL);
    pda.addTransition(q1, q1, "c", "c", EMPTY_SYMBOL);

    //q1 -> q2 final transition
    pda.addTransition(q1, q2, "a", EMPTY_SYMBOL, "a");

    pda.setFinalState(q2);

    return pda;
}

describe("Test case 1", () =>
{
    const pda = createTestMachine();
    test("is a valid PDA", () =>
    {
        expect(pda).toBeDefined();
        expect(pda.validate()).toBe(true);
        expect(pda.isValid()).toBe(true);
    });

    test("has correct start state", () =>
    {
        expect(pda.getStartState().getStateLabel()).toBe("q0");
    });

    // test("accepts empty string", () =>
    // {
    //     let pda = createTestMachine();
    //     expect(solvePDA(pda, EMPTY_SYMBOL)).toBe(true);
    // }, 5);

    // test("accepts 'a", () =>
    // {
    //     let pda = createTestMachine();
    //     expect(solvePDA(pda, 'a')).toBe(true);
    // }, 5);

    // test("accepts 'aba'", () =>
    // {
    //     let pda = createTestMachine();
    //     expect(solvePDA(pda, 'aba')).toBe(true);
    // }, 5);

    // test("accepts 'abcba'", () =>
    // {
    //     let pda = createTestMachine();
    //     expect(solvePDA(pda, 'abcba')).toBe(true);
    // }, 5);

    // test("rejects 'abc'", () =>
    // {
    //     let pda = createTestMachine();
    //     expect(solvePDA(pda, 'abc')).toBe(false);
    // }, 5);
});