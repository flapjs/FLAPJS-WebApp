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


describe('Testing copy constructor of CFG', () => {
    const variables = new Set(["S"]);
    const terminals = new Set(["a", "b"]);
    const r1 = new Rule("S", "aSb");
    const r2 = new Rule("S", EMPTY);
    const startVariable = "S";

    const cfg1= new CFG(variables, terminals, [r1, r2], startVariable);
    cfg1._errors.push(new Error("For test purpose"));
    const cfg2 = new CFG();
    cfg2.copyFromCFG(cfg1);

    test('test if variables are equal', () => {
        expect(cfg2._variables.has('S')).toBe(true);
        expect(cfg2._variables.has('U')).toBe(false);
    });
    test('test if terminals are equal', () => {
        expect(cfg2._terminals.has('a')).toBe(true);
        expect(cfg2._terminals.has('b')).toBe(true);
        expect(cfg2._terminals.has('c')).toBe(false);
    });
    test('test if the rules are the same', () => {
        expect(cfg2._rules[0].isEqual(r1)).toBe(true);
        expect(cfg2._rules[1].isEqual(r2)).toBe(true);
    });
    test('test if the startVariables are the same', () => {
        expect(cfg2._startVariable.localeCompare('S')).toBe(0);
    });
    test('test if the errors are the same', () => {
        expect(cfg2._errors[0].message.localeCompare('For test purpose')).toBe(0);
    });

    // then modify cfg1 to see if cfg2 is also changed, changes should not happen since we 
    // want it to be pure
    cfg1._variables = new Set('B');
    cfg1._terminals = new Set('d');
    cfg1._rules = [new Rule('B -> d')];
    cfg1._startVariable = 'B';
    cfg1._errors = [];

    // what was true should still be true
    test('test if variables are still equal', () => {
        expect(cfg2._variables.has('S')).toBe(true);
        expect(cfg2._variables.has('B')).toBe(false);
    });
    test('test if terminals are still equal', () => {
        expect(cfg2._terminals.has('a')).toBe(true);
        expect(cfg2._terminals.has('b')).toBe(true);
        expect(cfg2._terminals.has('d')).toBe(false);
    });
    test('test if the rules are still the same', () => {
        expect(cfg2._rules[0].isEqual(r1)).toBe(true);
        expect(cfg2._rules[1].isEqual(r2)).toBe(true);
        expect(cfg2._rules.length).toBe(2);
    });
    test('test if the startVariables are still the same', () => {
        expect(cfg2._startVariable.localeCompare('S')).toBe(0);
    });
    test('test if the errors are still the same', () => {
        expect(cfg2._errors[0].message.localeCompare('For test purpose')).toBe(0);
        expect(cfg2._errors.length).toBe(1);
    });
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
