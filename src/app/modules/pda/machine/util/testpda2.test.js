/* eslint-disable quotes */
/* eslint-disable no-undef */
import PDA, { EMPTY_SYMBOL } from '../PDA.js';
import { solvePDA } from '../PDAUtils.js';

function createTestMachine()
{
    const pda = new PDA(true);

    // Build PDA...
    // Example 1_11
    const q1 = pda.createState("q1");
    const q2 = pda.createState("q2");
    const q3 = pda.createState("q3");
    const q4 = pda.createState("q4");


    pda.addTransition(q1, q2, EMPTY_SYMBOL, EMPTY_SYMBOL, "$");
    pda.addTransition(q2, q2, "0", EMPTY_SYMBOL, "0");
    pda.addTransition(q2, q3, "1", "0", EMPTY_SYMBOL);
    pda.addTransition(q3, q3, "1", "0", EMPTY_SYMBOL);
    pda.addTransition(q3, q4, EMPTY_SYMBOL, "$", EMPTY_SYMBOL);
    pda.setFinalState(q4);

    return pda;
}

describe("Test case 2", () =>
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
        expect(pda.getStartState().getStateLabel()).toBe("q1");
    });

    test("accepts '000111'", () =>
    {
        let pda = createTestMachine();
        expect(solvePDA(pda, "000111")).toBe(true);
    });

    test("shouldn't accepts '0001111'", () =>
    {
        let pda = createTestMachine();
        expect(solvePDA(pda, "0001111")).toBe(false);
    });

    test("shouldn't accepts '1000111'", () =>
    {
        let pda = createTestMachine();
        expect(solvePDA(pda, "1000111")).toBe(false);
    });
})