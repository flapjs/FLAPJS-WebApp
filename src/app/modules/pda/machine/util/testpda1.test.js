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


    pda.addTransition(q0, q0, "b", EMPTY_SYMBOL, EMPTY_SYMBOL);
    pda.addTransition(q0, q1, "a", EMPTY_SYMBOL, "a");
    pda.addTransition(q1, q2, EMPTY_SYMBOL, "a", EMPTY_SYMBOL);
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

    test("accepts 'bbabb'", () =>
    {
        let pda = createTestMachine();
        expect(solvePDA(pda, "bbabb")).toBe(false);
    });
});