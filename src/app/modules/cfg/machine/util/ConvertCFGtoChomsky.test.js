import PDA, { EMPTY_SYMBOL } from 'modules/pda/machine/PDA.js';
import { solvePDA } from 'modules/pda/machine/PDAUtils.js';
import {convertToPDA} from './ConvertCFG.js';
import CFG, {Rule, PIPE} from '../CFG.js';
import { EMPTY } from 'modules/re/machine/RE.js';
import { newStartVariable } from './ConvertCFGtoChomsky.js';
import { getConsoleOutput } from '@jest/console';

describe('Testing indicesOf() method of Rule', () => {
    let rule1 = new Rule('A', 'A_1A_2A_3A_1A_11');
    let rule2 = new Rule('A', 'A_1A_2A_3A_11A_1');
    let rule3 = new Rule('A', 'A_1A_2A_3A_11A_1A_2');

    test('Testing the Rule \'A -> A_1A_2A_3A_1A_11\'', () => {
        expect(rule1.indicesOf('A_1')).toEqual([0, 9]);
    });
    test('Testing the Rule \'A -> A_1A_2A_3A_11A_1\'', () => {
        expect(rule2.indicesOf('A_1')).toEqual([0, 13]);
    }); 
    test('Testing the Rule \'A -> A_1A_2A_3A_11A_1A_2\'', () => {
        expect(rule3.indicesOf('A_1')).toEqual([0, 13]);
    }); 
});

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

describe('Testing function newStartVariable()', () => {
    let variables = new Set(['A', 'B']);
    let terminals = new Set(['a', 'b']);
    let rule1 = new Rule('A', 'a');
    let rule2 = new Rule('B', 'bAb');
    let cfg = new CFG(variables, terminals, [rule1, rule2], 'B');

    let result = newStartVariable(cfg);

    test('Test if result\'s start variable is S_New', () => {
        expect(result.getStartVariable().localeCompare('S_New')).toBe(0);
    });
    test('Test if result has the rule \'S_New -> B\'', () => {
        expect(result.hasRule(new Rule('S_New', 'B'))).toBe(true);
    });
    test('Test if result has the rule \'B -> bAb\'', () => {
        expect(result.hasRule(new Rule('B', 'bAb'))).toBe(true);
    });
    test('Test if result has the rule \'A -> a\'', () => {
        expect(result.hasRule(new Rule('A', 'a'))).toBe(true);
    });
    // again, we want to ensure this function is pure
    test('Test if the previous cfg stays unchanged', () => {
        expect(cfg.getStartVariable().localeCompare('B')).toBe(0);
        expect(cfg.hasRule(new Rule('S_New', 'B'))).toBe(false);
        expect(cfg.hasRule(new Rule('B', 'bAb'))).toBe(true);
    });
    test('Test isEqual of Rule', () => {
        let r1 = new Rule('A', 'B');
        let r2 = new Rule('B', 'A');
        expect(r1.isEqual(r2)).toBe(false);
    });
});