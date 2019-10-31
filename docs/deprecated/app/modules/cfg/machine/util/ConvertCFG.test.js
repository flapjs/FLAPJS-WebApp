import PDA, { EMPTY_SYMBOL } from 'modules/pda/machine/PDA.js';
import { solvePDA } from 'modules/pda/machine/PDAUtils.js';
import {convertToPDA} from './ConvertCFG.js';
import CFG, {Rule, PIPE} from '../CFG.js';
import { EMPTY } from 'modules/re/machine/RE.js';

function testSolvePDA(machine, testString, expectedResult=true)
{
  test("test string \'" + testString + "\'", () => {
    expect(solvePDA(machine, testString)).toBe(expectedResult);
  });
}


describe("Testing CFG: \'{ a^nb^n | n>=0 }\'", () => {
    const variables = new Set(["S"]);
    const terminals = new Set(["a", "b"]);
    const r1 = new Rule("S", "aSb");
    const r2 = new Rule("S", EMPTY);
    const startVariable = "S";

    const cfg = new CFG(variables, terminals, [r1, r2], startVariable);
    const machine = convertToPDA(cfg);

    //Test strings
    testSolvePDA(machine, "a", false);
    testSolvePDA(machine, "b", false);
    testSolvePDA(machine, "aab", false);
    testSolvePDA(machine, "bbaa", false);
    testSolvePDA(machine, "aabbb", false);
    testSolvePDA(machine, "aaabbb", true);
    testSolvePDA(machine, "ab", true);
    testSolvePDA(machine, "", true);
    testSolvePDA(machine, "aaaaabbbbb", true);
});

describe("Testing CFG: \'{ a^nb^n | n>=0 }\' (Same thing but with PIPEd rule)", () => {
    const variables = new Set(["S"]);
    const terminals = new Set(["a", "b"]);
    const r1 = new Rule("S", `aSb ${PIPE} ${EMPTY}`);  // S -> aSb | EMPTY
    const startVariable = "S";

    const cfg = new CFG(variables, terminals, [r1], startVariable);
    const machine = convertToPDA(cfg);

    //Test strings
    testSolvePDA(machine, "a", false);
    testSolvePDA(machine, "b", false);
    testSolvePDA(machine, "aab", false);
    testSolvePDA(machine, "bbaa", false);
    testSolvePDA(machine, "aabbb", false);
    testSolvePDA(machine, "aaabbb", true);
    testSolvePDA(machine, "ab", true);
    testSolvePDA(machine, "", true);
    testSolvePDA(machine, "aaaaabbbbb", true);
});


describe("Testing CFG: \'{ 0^i1^j0^k | i==j || j==k }\'PIPED", () => {
    const variables = new Set(["S", "A", "B", "C"]);
    const terminals = new Set(["0", "1"]);
    const r1 = new Rule("S", `AC ${PIPE} CB`);          // S -> AC | CD
    const r2 = new Rule("A", `0A1 ${PIPE} ${EMPTY}`);   // A -> 0A1 | EMPTY
    const r3 = new Rule("B", `1B0 ${PIPE} ${EMPTY}`);   // B -> 1B0 | EMPTY
    const r4 = new Rule("C", `0C ${PIPE} ${EMPTY}`);    // C -> 0C | EMPTY
    const startVariable = "S";

    const cfg = new CFG(variables, terminals, [r1, r2, r3, r4], startVariable);
    const machine = convertToPDA(cfg);

    //Test strings
    testSolvePDA(machine, "1", false);
    testSolvePDA(machine, "011000", false);
    testSolvePDA(machine, "111", false);
    testSolvePDA(machine, "00100", false);
    testSolvePDA(machine, "0", true);
    testSolvePDA(machine, "000", true);
    testSolvePDA(machine, "00110", true);
    testSolvePDA(machine, "00111000", true);
    testSolvePDA(machine, "", true);
    testSolvePDA(machine, "000111000", true);
});


describe("Testing CFG: \'{ w E {0, 1}* | # of 1's == # of 0's }\'", () => {
    const variables = new Set(["S"]);
    const terminals = new Set(["0", "1"]);
    const r1 = new Rule("S", `0S1S ${PIPE} 1S0S ${PIPE} ${EMPTY}`)
    const startVariable = "S";

    const cfg = new CFG(variables, terminals, [r1], startVariable);
    const machine = convertToPDA(cfg);

    //Test strings
    testSolvePDA(machine, "1", false);
    testSolvePDA(machine, "011000", false);
    testSolvePDA(machine, "111", false);
    testSolvePDA(machine, "001001", false);
    testSolvePDA(machine, "0", false);
    testSolvePDA(machine, "001011", true);
    testSolvePDA(machine, "01010101010101", true);
    testSolvePDA(machine, "", true);
    testSolvePDA(machine, "0101010011", true);
});
