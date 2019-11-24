import CFG, { Rule } from '../CFG.js';
import { EMPTY } from '@flapjs/modules/re/machine/RE.js';
import {
    newStartVariable,
    eliminateEpsilonVariable,
    eliminateEpsilonRules,
    /* convertCFGtoChomsky, */
    eliminateUnitRules,
    parseRHS,
    /* breakLongRule, */
    /* convertRulesIntoProperForm, */
} from './ConvertCFGtoChomsky.js';

// use Rule.toString() to construct a set and then strict equal
function testCFGEqual(cfg1, cfg2) 
{
    expect(cfg1._variables).toStrictEqual(cfg2._variables);
    expect(cfg1._terminals).toStrictEqual(cfg2._terminals);
    expect(cfg1._startVariable).toStrictEqual(cfg2._startVariable);
    expect(cfg1._errors).toStrictEqual(cfg2._errors); // maybe no

    let rule1 = cfg1._rules;
    let rule2 = cfg2._rules;
    rule1 = rule1.map((cur) => 
    {
        return cur.toString();
    });
    rule2 = rule2.map((cur) => 
    {
        return cur.toString();
    });

    // then construct sets and use sets strictEqual
    rule1 = new Set(rule1);
    rule2 = new Set(rule2);
    //console.log(rule1);
    //console.log(rule2);
    expect(rule1).toStrictEqual(rule2);
}

describe('Testing removeRule() method of CFG', () =>
{
    let variables = new Set(['A', 'B']);
    let terminals = new Set(['a', 'b']);
    let rule = [
        new Rule('A', EMPTY),
        new Rule('B', 'bAbAbAb'),
        new Rule('B', 'AbAbA')
    ];
    let startVariable = 'A';
    let cfg = new CFG(variables, terminals, rule, startVariable);

    cfg.removeRule(new Rule('A', EMPTY));
    let expectedResult = [
        new Rule('B', 'bAbAbAb'),
        new Rule('B', 'AbAbA')
    ];
    test('Testing removeRule(\'A -> EMPTY\') on \'A -> EMPTY, B -> bAbAbAb | AbAbA\'', () => 
    {
        expect(cfg._rules).toStrictEqual(expectedResult);
    });
});

describe('Testing copy constructor of CFG', () => 
{
    const variables = new Set(['S']);
    const terminals = new Set(['a', 'b']);
    const r1 = new Rule('S', 'aSb');
    const r2 = new Rule('S', EMPTY);
    const startVariable = 'S';

    const cfg1= new CFG(variables, terminals, [r1, r2], startVariable);
    cfg1._errors.push(new Error('For test purpose'));
    const cfg2 = new CFG();
    cfg2.copyFromCFG(cfg1);

    test('test if variables are equal', () =>
    {
        expect(cfg2._variables.has('S')).toBe(true);
        expect(cfg2._variables.has('U')).toBe(false);
    });
    test('test if terminals are equal', () =>
    {
        expect(cfg2._terminals.has('a')).toBe(true);
        expect(cfg2._terminals.has('b')).toBe(true);
        expect(cfg2._terminals.has('c')).toBe(false);
    });
    test('test if the rules are the same', () =>
    {
        expect(cfg2._rules[0].isEqual(r1)).toBe(true);
        expect(cfg2._rules[1].isEqual(r2)).toBe(true);
    });
    test('test if the startVariables are the same', () =>
    {
        expect(cfg2._startVariable.localeCompare('S')).toBe(0);
    });
    test('test if the errors are the same', () => 
    {
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
    test('test if variables are still equal', () => 
    {
        expect(cfg2._variables.has('S')).toBe(true);
        expect(cfg2._variables.has('B')).toBe(false);
    });
    test('test if terminals are still equal', () => 
    {
        expect(cfg2._terminals.has('a')).toBe(true);
        expect(cfg2._terminals.has('b')).toBe(true);
        expect(cfg2._terminals.has('d')).toBe(false);
    });
    test('test if the rules are still the same', () => 
    {
        expect(cfg2._rules[0].isEqual(r1)).toBe(true);
        expect(cfg2._rules[1].isEqual(r2)).toBe(true);
        expect(cfg2._rules.length).toBe(2);
    });
    test('test if the startVariables are still the same', () => 
    {
        expect(cfg2._startVariable.localeCompare('S')).toBe(0);
    });
    test('test if the errors are still the same', () => 
    {
        expect(cfg2._errors[0].message.localeCompare('For test purpose')).toBe(0);
        expect(cfg2._errors.length).toBe(1);
    });
});

describe('Testing indicesOf() method of Rule', () => 
{
    let rule1 = new Rule('A', 'A_1A_2A_3A_1A_11');
    let rule2 = new Rule('A', 'A_1A_2A_3A_11A_1');
    let rule3 = new Rule('A', 'A_1A_2A_3A_11A_1A_2');

    test('Testing the Rule \'A -> A_1A_2A_3A_1A_11\'', () => 
    {
        expect(rule1.indicesOf('A_1')).toEqual([0, 9]);
    });
    test('Testing the Rule \'A -> A_1A_2A_3A_11A_1\'', () => 
    {
        expect(rule2.indicesOf('A_1')).toEqual([0, 13]);
    }); 
    test('Testing the Rule \'A -> A_1A_2A_3A_11A_1A_2\'', () => 
    {
        expect(rule3.indicesOf('A_1')).toEqual([0, 13]);
    }); 
});

describe('Testing parseRHS() function of ConvertCFGtoChomsky', () => 
{
    test('Testing A_1aAB_3Rcb', () => 
    {
        let string = 'A_1aAB_3Rcb';
        let result = parseRHS(string);
        let expectedResult = ['A_1', 'a', 'A', 'B_3', 'R', 'c', 'b'];
        expect(result).toStrictEqual(expectedResult);
    });

    test('Testing AA_1A_2A_3A_11A_1A_2', () => 
    {
        let string = 'AA_1A_2A_3A_11A_1A_2';
        let result = parseRHS(string);
        let expectedResult = ['A', 'A_1', 'A_2', 'A_3', 'A_11', 'A_1', 'A_2'];
        expect(result).toStrictEqual(expectedResult);
    });
});

describe('Testing newStartVariable() function of ConvertCFGtoChomsky', () => 
{
    let variables = new Set(['A', 'B']);
    let terminals = new Set(['a', 'b']);
    let rule1 = new Rule('A', 'a');
    let rule2 = new Rule('B', 'bAb');
    let cfg = new CFG(variables, terminals, [rule1, rule2], 'B');

    let result = newStartVariable(cfg);

    test('Test if result\'s start variable is S_New', () => 
    {
        expect(result.getStartVariable().localeCompare('S_New')).toBe(0);
    });
    test('Test if result has the rule \'S_New -> B\'', () => 
    {
        expect(result.hasRule(new Rule('S_New', 'B'))).toBe(true);
    });
    test('Test if result has the rule \'B -> bAb\'', () => 
    {
        expect(result.hasRule(new Rule('B', 'bAb'))).toBe(true);
    });
    test('Test if result has the rule \'A -> a\'', () => 
    {
        expect(result.hasRule(new Rule('A', 'a'))).toBe(true);
    });
    // again, we want to ensure this function is pure
    test('Test if the previous cfg stays unchanged', () => 
    {
        expect(cfg.getStartVariable().localeCompare('B')).toBe(0);
        expect(cfg.hasRule(new Rule('S_New', 'B'))).toBe(false);
        expect(cfg.hasRule(new Rule('B', 'bAb'))).toBe(true);
    });
    test('Test isEqual of Rule', () => 
    {
        let r1 = new Rule('A', 'B');
        let r2 = new Rule('B', 'A');
        expect(r1.isEqual(r2)).toBe(false);
    });
});

describe('Testing eliminateEpsilonVariable() function of ConvertCFGtoChomsky', () => 
{
    let rule = new Rule('A', 'bAbAb');
    let addedRules = eliminateEpsilonVariable(rule, 'A');
    let expectedResult = [
        new Rule('A', 'bbb'),
        new Rule('A', 'bbAb'),
        new Rule('A', 'bAbb'),
    ];
    test('Testing the rules added after removing \'A\' from \'A -> bAbAb\'', () => 
    {
        expect(addedRules).toStrictEqual(expectedResult);
    });
    rule = new Rule('S_New', 'bA_1A_2bA_12bA_1A_1bA_1');
    addedRules = eliminateEpsilonVariable(rule, 'A_1');
    expectedResult = [
        new Rule('S_New', 'bA_2bA_12bb'), // 0000
        new Rule('S_New', 'bA_2bA_12bbA_1'), // 0001
        new Rule('S_New', 'bA_2bA_12bA_1b'), // 0010
        new Rule('S_New', 'bA_2bA_12bA_1bA_1'), // 0011
        new Rule('S_New', 'bA_2bA_12bA_1b'), // 0100
        new Rule('S_New', 'bA_2bA_12bA_1bA_1'), // 0101
        new Rule('S_New', 'bA_2bA_12bA_1A_1b'), // 0110
        new Rule('S_New', 'bA_2bA_12bA_1A_1bA_1'), // 0111
        new Rule('S_New', 'bA_1A_2bA_12bb'), // 1000
        new Rule('S_New', 'bA_1A_2bA_12bbA_1'), // 1001
        new Rule('S_New', 'bA_1A_2bA_12bA_1b'), // 1010
        new Rule('S_New', 'bA_1A_2bA_12bA_1bA_1'), // 1011
        new Rule('S_New', 'bA_1A_2bA_12bA_1b'), // 1100
        new Rule('S_New', 'bA_1A_2bA_12bA_1bA_1'), // 1101
        new Rule('S_New', 'bA_1A_2bA_12bA_1A_1b'), // 1110
    ];
    test('Testing the rules added after removing \'A_1\' from \'S_New -> bA_1A_2bA_12bA_1A_1bA_1\'', () => 
    {
        expect(addedRules).toStrictEqual(expectedResult);
    });
    // this one should return an empty array since there is no variable 'B' in the rule
    addedRules = eliminateEpsilonVariable(rule, 'B');
    expectedResult = [];
    test('Testing the rules added after removing \'B\' from \'S_New -> bA_1A_2bA_12bA_1A_1bA_1\'', () => 
    {
        expect(addedRules).toStrictEqual(expectedResult);
    });
    // this one should return an empty array since A -> epsilon was already eliminated
    rule = new Rule('A', 'B');
    addedRules = eliminateEpsilonVariable(rule, 'B', true);
    expectedResult = [];
    test('Testing the rules added after removing \'B\' from \'A -> B\', under the \
assumption that A -> epsilon was already eliminated', () => 
    {
        expect(addedRules).toStrictEqual(expectedResult);
    });
    // this one should return [A -> EMPTY]
    rule = new Rule('A', 'B');
    addedRules = eliminateEpsilonVariable(rule, 'B', false);
    expectedResult = [new Rule('A', EMPTY)];
    test('Testing the rules added after removing \'B\' from \'A -> B\', under the \
assumption that A -> epsilon was not eliminated', () => 
    {
        expect(addedRules).toStrictEqual(expectedResult);
    });
});

describe('Testing eliminateEpsilonRules() function of ConvertCFGtoChomsky', () => 
{
    // start with a rather small grammar
    let variables = new Set(['A', 'B']);
    let terminals = new Set(['a', 'b', EMPTY]);
    let rule = [
        new Rule('A', EMPTY),
        new Rule('B', 'bAbAbAb'),
        new Rule('B', 'AbAbA')
    ];
    let startVariable = 'A';
    let cfg = new CFG(variables, terminals, rule, startVariable);

    test('Testing the grammar {A -> epsilon, B -> bAbAbAb | AbAbA}', () => 
    {
        let result = eliminateEpsilonRules(cfg);
        variables = new Set(['B']);
        terminals = new Set(['a', 'b']);
        rule = [
            new Rule('B', 'bbbb'),
            new Rule('B', 'bb')
        ];
        let expectedResult = new CFG(variables, terminals, rule, startVariable);
        expect(result).toStrictEqual(expectedResult);
    });

    test('Testing on the same grammar as the previous test, but with order of rules switched', () => 
    {
        variables = new Set(['B']);
        terminals = new Set(['a', 'b']);
        let rule = [
            new Rule('B', 'bAbAbAb'),
            new Rule('A', EMPTY),
            new Rule('B', 'AbAbA')
        ];
        cfg = new CFG(variables, terminals, rule, startVariable);
        rule = [
            new Rule('B', 'bbbb'),
            new Rule('B', 'bb')
        ];
        let result = eliminateEpsilonRules(cfg);
        let expectedResult = new CFG(variables, terminals, rule, startVariable);
        expect(result).toStrictEqual(expectedResult);
    });

    // let's try the example in the book!
    test('Let\'s try the example in the book!', () => 
    {
        variables = new Set(['S', 'A', 'B']);
        terminals = new Set(['a', 'b', EMPTY]);
        rule = [
            new Rule('S', 'ASA'),
            new Rule('S', 'aB'),
            new Rule('A', 'B'),
            new Rule('A', 'S'),
            new Rule('B', 'b'),
            new Rule('B', EMPTY)
        ];
        startVariable = 'S';
        cfg = new CFG(variables, terminals, rule, startVariable);
        let result = eliminateEpsilonRules(cfg);
        terminals.delete(EMPTY);
        rule = [
            new Rule('S', 'ASA'),
            new Rule('S', 'aB'),
            new Rule('S', 'a'),
            new Rule('S', 'SA'),
            new Rule('S', 'AS'),
            new Rule('S', 'S'),
            new Rule('A', 'B'),
            new Rule('A', 'S'),
            new Rule('B', 'b'),
        ];
        let expectedResult = new CFG(variables, terminals, rule, startVariable);
        testCFGEqual(result, expectedResult);
    });

    test('Testing the grammar {S -> BABA, A -> aA | epsilon, ' +
        'B -> bB | epsilon}', () => 
    {
        variables = new Set(['S', 'A', 'B']);
        terminals = new Set(['a', 'b', EMPTY]);
        startVariable = 'S';
        rule = [
            new Rule('S', 'BABA'),
            new Rule('A', 'aA'),
            new Rule('A', EMPTY),
            new Rule('B', 'bB'),
            new Rule('B', EMPTY)
        ];
        cfg = new CFG(variables, terminals, rule, startVariable);
        let result = eliminateEpsilonRules(cfg);
        // console.log(result);

        terminals = new Set(['a', 'b']);
        rule = [
            new Rule('A', 'aA'),
            new Rule('A', 'a'),
            new Rule('B', 'bB'),
            new Rule('B', 'b'),
            new Rule('S', 'BABA'),
            new Rule('S', 'BAB'),
            new Rule('S', 'BBA'),
            new Rule('S', 'BB'),
            new Rule('S', 'BAA'),
            new Rule('S', 'ABA'),
            new Rule('S', 'AA'),
            new Rule('S', 'BA'),
            new Rule('S', 'A'),
            new Rule('S', 'AB'),
            new Rule('S', 'B'),
        ];
        let expectedResult = new CFG(variables, terminals, rule, startVariable);
        testCFGEqual(result, expectedResult);
    });

    test('Testing the grammar {S -> AA,  A -> epsilon}', () => 
    {
        // debugger;
        variables = new Set(['S', 'A']);
        terminals = new Set([EMPTY]);
        startVariable = 'S';
        rule = [
            new Rule('S', 'AA'),
            new Rule('A', EMPTY)
        ];
        cfg = new CFG(variables, terminals, rule, startVariable);
        let result = eliminateEpsilonRules(cfg);
        variables = new Set();
        terminals = new Set();
        rule = [];
        let expectedResult = new CFG(variables, terminals, rule, startVariable);
        expect(result).toStrictEqual(expectedResult);
    });
});

describe('Testing eliminateUnitRules() functino of ConvertCFGtoChomsky', () => 
{
    test('Testing the grammar {S -> BABA, A -> aA | epsilon, B -> bB | epsilon}', () => 
    {
        let variables = new Set(['S', 'A', 'B']);
        let terminals = new Set(['a', 'b', EMPTY]);
        let startVariable = 'S';
        let rule = [
            new Rule('S', 'BABA'),
            new Rule('A', 'aA'),
            new Rule('A', EMPTY),
            new Rule('B', 'bB'),
            new Rule('B', EMPTY)
        ];
        let cfg = new CFG(variables, terminals, rule, startVariable);
        let result = eliminateEpsilonRules(cfg);
        result = eliminateUnitRules(result);
        terminals = new Set(['a', 'b']);
        rule = [
            new Rule('A', 'aA'),
            new Rule('A', 'a'),
            new Rule('B', 'bB'),
            new Rule('B', 'b'),
            new Rule('S', 'BABA'),
            new Rule('S', 'BAB'),
            new Rule('S', 'BBA'),
            new Rule('S', 'BB'),
            new Rule('S', 'BAA'),
            new Rule('S', 'ABA'),
            new Rule('S', 'AA'),
            new Rule('S', 'BA'),
            new Rule('S', 'AB'),
            new Rule('S', 'aA'),
            new Rule('S', 'a'),
            new Rule('S', 'bB'),
            new Rule('S', 'b')
        ];
        let expectedResult = new CFG(variables, terminals, rule, startVariable);
        testCFGEqual(result, expectedResult);
    });

    // let's try the example in the book!
    test('Let\'s try the example in the book!', () => 
    {
        let variables = new Set(['S', 'A', 'B']);
        let terminals = new Set(['a', 'b', EMPTY]);
        let rule = [
            new Rule('S', 'ASA'),
            new Rule('S', 'aB'),
            new Rule('A', 'B'),
            new Rule('A', 'S'),
            new Rule('B', 'b'),
            new Rule('B', EMPTY)
        ];
        let startVariable = 'S';
        let cfg = new CFG(variables, terminals, rule, startVariable);
        let result = newStartVariable(cfg);
        result = eliminateEpsilonRules(result);
        result = eliminateUnitRules(result);
        variables.add('S_New');
        terminals.delete(EMPTY);
        startVariable = 'S_New';
        rule = [
            new Rule('S_New', 'ASA'),
            new Rule('S_New', 'aB'),
            new Rule('S_New', 'a'),
            new Rule('S_New', 'SA'),
            new Rule('S_New', 'AS'),
            new Rule('S', 'ASA'),
            new Rule('S', 'aB'),
            new Rule('S', 'a'),
            new Rule('S', 'SA'),
            new Rule('S', 'AS'),
            new Rule('A', 'b'),
            new Rule('A', 'ASA'),
            new Rule('A', 'aB'),
            new Rule('A', 'a'),
            new Rule('A', 'SA'),
            new Rule('A', 'AS'),
            new Rule('B', 'b'),
        ];
        let expectedResult = new CFG(variables, terminals, rule, startVariable);
        testCFGEqual(result, expectedResult);
    });
});

describe('Testing convertRulesIntoProperForm() function of ConvertCFGtoChomsky', () => 
{
    test('Testing A -> A_1aAB_3Rcb', () => 
    {
        /*
        let string = 'A_1aAB_3Rcb';
        let variables = new Set(['A', 'A_1', 'B_3', 'R']);
        let terminals = new Set(['a', 'b', 'c']);
        let rule = [new Rule('A', string)];
        let startVariable = 'A';
        let cfg = new CFG(variables, terminals, rule, startVariable);
        let result = convertRulesIntoProperForm(cfg);
        // console.log(result);
        */
    });
});

describe('Testing convertCFGtoChomsky() of ConvertCFGtoChomsky', () => 
{
    // let's test the example in the book
    test('Let\'s test the example in the book!', () => 
    {
        /*
        let variables = new Set(['S', 'A', 'B']);
        let terminals = new Set(['a', 'b', EMPTY]);
        let rule = [
            new Rule('S', 'ASA'),
            new Rule('S', 'aB'),
            new Rule('A', 'B'),
            new Rule('A', 'S'),
            new Rule('B', 'b'),
            new Rule('B', EMPTY)
        ];
        let startVariable = 'S';
        let cfg = new CFG(variables, terminals, rule, startVariable);
        let result = convertCFGtoChomsky(cfg);
        // console.log(result);
        */
    });
});
