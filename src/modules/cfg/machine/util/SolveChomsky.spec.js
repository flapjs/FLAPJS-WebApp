import CFG, { Rule } from '../CFG.js';
import { EMPTY } from '@flapjs/modules/re/machine/RE.js';
import {solveChomsky} from './SolveChomsky.js';

function testSolveChomsky(cnf, testString, expectedResult=true)
{
    test('test string \'' + testString + '\'', () => 
    {
        expect(solveChomsky(cnf, testString)).toBe(expectedResult);
    });
}


describe('Testing CNF 1', () => 
{
    const variables = new Set(['S', 'A', 'Z']);
    const terminals = new Set(['a', 'z']);
    const r1 = new Rule('S', 'a');
    const r2 = new Rule('S', 'AZ');
    const r3 = new Rule('A', 'a');
    const r4 = new Rule('Z', 'z');
    const startVariable = 'S';

    const cnf = new CFG(variables, terminals, [r1, r2, r3, r4], startVariable);

    testSolveChomsky(cnf, 'a');
    testSolveChomsky(cnf, 'az');
    testSolveChomsky(cnf, 'aaz', false);
    testSolveChomsky(cnf, EMPTY, false);
    testSolveChomsky(cnf, '', false);
    testSolveChomsky(cnf, 'z', false);

});

describe('Testing CNF 2', () => 
{
    const variables = new Set(['S', 'A', 'Z']);
    const terminals = new Set(['a', 'z']);
    const r1 = new Rule('S', 'a');
    const r2 = new Rule('S', 'AZ');
    const r3 = new Rule('A', 'a');
    const r4 = new Rule('Z', 'z');
    const r5 = new Rule('S', EMPTY);          //Just added this
    const startVariable = 'S';

    const cnf = new CFG(variables, terminals, [r1, r2, r3, r4, r5], startVariable);

    testSolveChomsky(cnf, 'a');
    testSolveChomsky(cnf, 'az');
    testSolveChomsky(cnf, 'aaz', false);
    testSolveChomsky(cnf, EMPTY);
    testSolveChomsky(cnf, '');
    testSolveChomsky(cnf, 'z', false);

});


describe('Testing CNF: \'{ a^nb^n | n>=0 }\'', () => 
{
    const variables = new Set(['S', 'D', 'A', 'B']);
    const terminals = new Set(['a', 'b']);
    const r1 = new Rule('S', 'AD');
    const r2 = new Rule('D', 'SB');
    const r3 = new Rule('S', 'AB');
    const r4 = new Rule('A', 'a');
    const r5 = new Rule('B', 'b');
    const r6 = new Rule('S', EMPTY);
    const startVariable = 'S';

    const machine = new CFG(variables, terminals, [r1, r2, r3, r4, r5, r6], startVariable);

    testSolveChomsky(machine, 'a', false);
    testSolveChomsky(machine, 'b', false);
    testSolveChomsky(machine, 'aab', false);
    testSolveChomsky(machine, 'bbaa', false);
    testSolveChomsky(machine, 'aabbb', false);
    testSolveChomsky(machine, 'aaabbb', true);
    testSolveChomsky(machine, 'ab', true);
    testSolveChomsky(machine, '', true);
    testSolveChomsky(machine, EMPTY, true);
    testSolveChomsky(machine, 'aaaaabbbbb', true);

});


describe('Testing CNF: \'{ 0^i1^j0^k | i==j || j==k }\'', () => 
{
    const variables = new Set(['S',
        'A',// 0   1
        'B', 'E', 'F',
        'C',//1   2
        'D', 'I', 'J']);
    const terminals = new Set(['0', '1']);
    const r1 = new Rule('S', 'AC');
    const r2 = new Rule('S', 'CB');
    const r3 = new Rule('S', 'EC');
    const r4 = new Rule('S', '0');
    const r5 = new Rule('S', 'FI');
    const r6 = new Rule('S', 'FE');
    const r7 = new Rule('S', 'EF');
    const r8 = new Rule('S', 'EJ');
    const r9 = new Rule('A', 'EJ');
    const r10 = new Rule('J', 'AF');
    const r11 = new Rule('B', 'FI');
    const r12 = new Rule('I', 'BE');
    const r13 = new Rule('C', 'EC');
    const r14 = new Rule('A', 'EF');
    const r15 = new Rule('B', 'FE');
    const r16 = new Rule('F', '1');
    const r17 = new Rule('E', '0');
    const r18 = new Rule('C', '0');
    const r19 = new Rule('S', EMPTY);


    const startVariable = 'S';

    const machine = new CFG(variables, terminals, [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19], startVariable);

    testSolveChomsky(machine, '1', false);
    testSolveChomsky(machine, '011000', false);
    testSolveChomsky(machine, '111', false);
    testSolveChomsky(machine, '00100', false);
    testSolveChomsky(machine, '0', true);
    testSolveChomsky(machine, '000', true);
    testSolveChomsky(machine, '00110', true);
    testSolveChomsky(machine, '00111000', true);
    testSolveChomsky(machine, '', true);  //Failed        Unless I add the S->EMPTY rule, it will fail, let's hope the CFG->CNF takes this into account
    testSolveChomsky(machine, EMPTY, true);  //Failed     because the JFLAP version doesn't
    testSolveChomsky(machine, '000111000', true);

});


describe('Testing CNF: \'{ w E {0, 1}* | # of 1\'s == # of 0\'s }\'', () => 
{
    const variables = new Set(['S',
        'B', 'C',
        'D', 'E', 'F', 'G', 'H', 'I']);
    const terminals = new Set(['0', '1']);
    const r1 = new Rule('S', 'CI');
    const r2 = new Rule('I', 'SG');
    const r3 = new Rule('S', 'BH');
    const r4 = new Rule('H', 'SE');
    const r5 = new Rule('S', 'CB');
    const r6 = new Rule('S', 'CG');
    const r7 = new Rule('G', 'BS');
    const r8 = new Rule('S', 'CF');
    const r9 = new Rule('F', 'SB');
    const r10 = new Rule('S', 'BC');
    const r11 = new Rule('S', 'BE');
    const r12 = new Rule('E', 'CS');
    const r13 = new Rule('S', 'BD');
    const r14 = new Rule('D', 'SC');
    const r15 = new Rule('B', '0');
    const r16 = new Rule('C', '1');
    const r17 = new Rule('S', EMPTY);

    const startVariable = 'S';

    const machine = new CFG(variables, terminals, [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17], startVariable);

    //Test strings
    testSolveChomsky(machine, '1', false);
    testSolveChomsky(machine, '011000', false);
    testSolveChomsky(machine, '111', false);
    testSolveChomsky(machine, '001001', false);
    testSolveChomsky(machine, '0', false);
    testSolveChomsky(machine, '001011', true);
    testSolveChomsky(machine, '01010101010101', true);
    testSolveChomsky(machine, '', true);
    testSolveChomsky(machine, EMPTY, true);
    testSolveChomsky(machine, '0101010011', true);
});
