import PDA, { EMPTY_SYMBOL } from '../PDA.js';
// eslint-disable-next-line no-unused-vars
import { solvePDA, solvePDAByStep } from '../PDAUtils.js';

function testSolvePDA(machine, testString, expectedResult=true)
{
    test('test string \'' + testString + '\'', () => 
    {
        expect(solvePDA(machine, testString)).toBe(expectedResult);
    });
}

//Machine acceptes n 0 infornt of n 1
describe('Testing PDA machine: \'1*\'', () => 
{
    const machine = new PDA();
    const state4 = machine.createState('q4');
    const state1 = machine.createState('q1');
    const state2 = machine.createState('q2');
    const state3 = machine.createState('q3');
    machine.addTransition(state1, state2, EMPTY_SYMBOL, EMPTY_SYMBOL, '$');
    machine.addTransition(state2, state2, '0', EMPTY_SYMBOL, '0');
    machine.addTransition(state2, state3, '1', '0', EMPTY_SYMBOL);
    machine.addTransition(state3, state3, '1', '0', EMPTY_SYMBOL);
    machine.addTransition(state3, state4, EMPTY_SYMBOL, '$', EMPTY_SYMBOL);
    machine.setStartState(state1);
    machine.setFinalState(state1);
    machine.setFinalState(state4);

    test('machine accepts the empty string since start state is also final', () => 
    {
        expect(solvePDA(machine, '')).toBe(true);
    });

    //Test strings
    testSolvePDA(machine, '0', false);
    testSolvePDA(machine, '1', false);
    testSolvePDA(machine, '011111', false);
    testSolvePDA(machine, '11010101', false);
    testSolvePDA(machine, '1111', false);
    testSolvePDA(machine, '0011', true);
    testSolvePDA(machine, '01', true);
    testSolvePDA(machine, '000111', true);
});

//machine accept string with at least three 1's
describe('Testing PDA machine: \'2*\'', () => 
{
    const machine = new PDA();
    const state1 = machine.createState('q1');
    const state2 = machine.createState('q2');
    const state3 = machine.createState('q3');
    const state4 = machine.createState('q4');
    machine.addTransition(state1, state1, '0', EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state1, state2, '1', EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state2, state2, '0', EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state2, state3, '1', EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state3, state3, '0', EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state3, state4, '1', EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state4, state4, '0', EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state4, state4, '1', EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.setStartState(state1);
    machine.setFinalState(state4);

    test('machine accepts the empty string since start state is also final', () => 
    {
        expect(solvePDA(machine, '')).toBe(false);
    });

    //Test strings
    testSolvePDA(machine, '0', false);
    testSolvePDA(machine, '1', false);
    testSolvePDA(machine, '01010', false);
    testSolvePDA(machine, '000', false);
    testSolvePDA(machine, '000111', true);
    testSolvePDA(machine, '0001', false);
});

//machine accept palindroms with odd length
describe('Testing PDA machine: \'3*\'', () => 
{
    const machine = new PDA();
    const state1 = machine.createState('q1');
    const state2 = machine.createState('q2');
    const state3 = machine.createState('q3');
    const state4 = machine.createState('q4');
    machine.addTransition(state1, state2, EMPTY_SYMBOL, EMPTY_SYMBOL, '$');
    machine.addTransition(state2, state2, '0', EMPTY_SYMBOL, '0');
    machine.addTransition(state2, state2, '1', EMPTY_SYMBOL, '1');
    machine.addTransition(state2, state3, '1', EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state2, state3, '0', EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state3, state3, '1', '1', EMPTY_SYMBOL);
    machine.addTransition(state3, state3, '0', '0', EMPTY_SYMBOL);
    machine.addTransition(state3, state4, EMPTY_SYMBOL, '$', EMPTY_SYMBOL);
    machine.setStartState(state1);
    machine.setFinalState(state4);

    test('machine accepts the empty string since start state is also final', () => 
    {
        expect(solvePDA(machine, '')).toBe(false);
    });

    //Test strings
    testSolvePDA(machine, '0', true);
    testSolvePDA(machine, '1', true);
    testSolvePDA(machine, '01010', true);
    testSolvePDA(machine, '000', true);
    testSolvePDA(machine, '000111', false);
    testSolvePDA(machine, '0001', false);
    testSolvePDA(machine, '0110', false);
});


//machine accept palindroms
describe('Testing PDA machine: \'4*\'', () => 
{
    const machine = new PDA();
    const state1 = machine.createState('q1');
    const state2 = machine.createState('q2');
    const state3 = machine.createState('q3');
    const state4 = machine.createState('q4');
    machine.addTransition(state1, state2, EMPTY_SYMBOL, EMPTY_SYMBOL, '$');
    machine.addTransition(state2, state2, '0', EMPTY_SYMBOL, '0');
    machine.addTransition(state2, state2, '1', EMPTY_SYMBOL, '1');
    machine.addTransition(state2, state3, '1', EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state2, state3, '0', EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state2, state3, EMPTY_SYMBOL, EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state3, state3, '1', '1', EMPTY_SYMBOL);
    machine.addTransition(state3, state3, '0', '0', EMPTY_SYMBOL);
    machine.addTransition(state3, state4, EMPTY_SYMBOL, '$', EMPTY_SYMBOL);
    machine.setStartState(state1);
    machine.setFinalState(state4);
    machine.setFinalState(state1);

    test('machine accepts the empty string since start state is also final', () => 
    {
        expect(solvePDA(machine, '')).toBe(true);
    });

    //Test strings
    testSolvePDA(machine, '0', true);
    testSolvePDA(machine, '1', true);
    testSolvePDA(machine, '01010', true);
    testSolvePDA(machine, '000', true);
    testSolvePDA(machine, '000111', false);
    testSolvePDA(machine, '0001', false);
    testSolvePDA(machine, '0110', true);
});


//machine language is EMPTY_SYMBOL
describe('Testing PDA machine: \'5*\'', () => 
{
    const machine = new PDA();
    const state1 = machine.createState('q1');
    machine.setStartState(state1);

    test('machine accepts the empty string since start state is also final', () => 
    {
        expect(solvePDA(machine, '')).toBe(false);
    });

    //Test strings
    testSolvePDA(machine, '0', false);
    testSolvePDA(machine, '1', false);
    testSolvePDA(machine, '01010', false);
    testSolvePDA(machine, '000', false);
    testSolvePDA(machine, '000111', false);
    testSolvePDA(machine, '0001', false);
    testSolvePDA(machine, '0110', false);
});

//machine accept a^i b^j c^k and i = j or j = k
describe('Testing PDA machine: \'6*\'', () => 
{
    const machine = new PDA();
    const state1 = machine.createState('q1');
    const state2 = machine.createState('q2');
    const state3 = machine.createState('q3');
    const state4 = machine.createState('q4');
    const state5 = machine.createState('q5');
    const state6 = machine.createState('q6');
    const state7 = machine.createState('q7');
    const state8 = machine.createState('q8');
    machine.addTransition(state1, state2, EMPTY_SYMBOL, EMPTY_SYMBOL, '$');
    machine.addTransition(state1, state5, EMPTY_SYMBOL, EMPTY_SYMBOL, '$');
    machine.addTransition(state2, state2, 'a', EMPTY_SYMBOL, 'a');
    machine.addTransition(state2, state3, EMPTY_SYMBOL, EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state3, state3, 'b', 'a', EMPTY_SYMBOL);
    machine.addTransition(state3, state4, EMPTY_SYMBOL, '$', EMPTY_SYMBOL);
    machine.addTransition(state4, state4, 'c', EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state5, state5, 'a', EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state5, state6, EMPTY_SYMBOL, EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state6, state6, 'b', EMPTY_SYMBOL, 'b');
    machine.addTransition(state6, state7, EMPTY_SYMBOL, EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state7, state7, 'c', 'b', EMPTY_SYMBOL);
    machine.addTransition(state7, state8, EMPTY_SYMBOL, '$', EMPTY_SYMBOL);
    machine.setStartState(state1);
    machine.setFinalState(state4);
    machine.setFinalState(state8);

    test('machine accepts the empty string since start state is also final', () => 
    {
        expect(solvePDA(machine, '')).toBe(true);
    });

    //Test strings
    testSolvePDA(machine, 'aabb', true);
    testSolvePDA(machine, 'bbcc', true);
    testSolvePDA(machine, 'abc', true);
    testSolvePDA(machine, 'cab', false);
    testSolvePDA(machine, 'abbcc', true);
    testSolvePDA(machine, 'b', false);
    testSolvePDA(machine, 'a', true);
});

//a^i b^j c^k i,j,k >= 0 and i +j = k
describe('Testing PDA machine: \'7*\'', () => 
{
    const machine = new PDA();
    const state1 = machine.createState('q1');
    const state2 = machine.createState('q2');
    const state3 = machine.createState('q3');
    const state4 = machine.createState('q4');
    const state5 = machine.createState('q5');
    machine.addTransition(state1, state2, EMPTY_SYMBOL, EMPTY_SYMBOL, '$');
    machine.addTransition(state2, state2, 'a', EMPTY_SYMBOL, 'x');
    machine.addTransition(state2, state3, EMPTY_SYMBOL, EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state3, state3, 'b', EMPTY_SYMBOL, 'x');
    machine.addTransition(state3, state4, EMPTY_SYMBOL, EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state4, state4, 'c', 'x', EMPTY_SYMBOL);
    machine.addTransition(state4, state5, EMPTY_SYMBOL, '$', EMPTY_SYMBOL);
    machine.setStartState(state1);
    machine.setFinalState(state5);

    test('machine accepts the empty string since start state is also final', () => 
    {
        expect(solvePDA(machine, '')).toBe(true);
    });

    //Test strings
    testSolvePDA(machine, 'abcc', true);
    testSolvePDA(machine, 'aacc', true);
    testSolvePDA(machine, 'bbcc', true);
    testSolvePDA(machine, 'bc', true);
    testSolvePDA(machine, 'abc', false);
    testSolvePDA(machine, 'ac', true);
    testSolvePDA(machine, 'accb', false);
});


//a^2n b^3n
describe('Testing PDA machine: \'8*\'', () => 
{
    const machine = new PDA();
    const state1 = machine.createState('q1');
    const state2 = machine.createState('q2');
    const state3 = machine.createState('q3');
    const state4 = machine.createState('q4');
    const state5 = machine.createState('q5');
    const state6 = machine.createState('q6');
    const state7 = machine.createState('q7');
    machine.addTransition(state1, state2, EMPTY_SYMBOL, EMPTY_SYMBOL, '$');
    machine.addTransition(state2, state3, 'a', EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state3, state2, 'a', EMPTY_SYMBOL, 'x');
    machine.addTransition(state2, state4, EMPTY_SYMBOL, EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state4, state5, 'b', EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state5, state6, 'b', EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state6, state4, 'b', 'x', EMPTY_SYMBOL);
    machine.addTransition(state4, state7, EMPTY_SYMBOL, '$', EMPTY_SYMBOL);
    machine.setStartState(state1);
    machine.setFinalState(state7);

    test('machine accepts the empty string since start state is also final', () => 
    {
        expect(solvePDA(machine, '')).toBe(true);
    });

    //Test strings
    testSolvePDA(machine, 'aabbb', true);
    testSolvePDA(machine, 'abb', false);
    testSolvePDA(machine, 'bbcc', false);
    testSolvePDA(machine, 'bc', false);
    testSolvePDA(machine, 'ab', false);
    testSolvePDA(machine, 'aaaabbbbbb', true);
});

//machine accept palindroms with odd length
describe('Testing PDA machine: \'9*\'', () => 
{
    const machine = new PDA();
    const state1 = machine.createState('q1');
    const state2 = machine.createState('q2');
    const state3 = machine.createState('q3');
    machine.addTransition(state1, state2, EMPTY_SYMBOL, EMPTY_SYMBOL, '$');
    machine.addTransition(state2, state2, '[', EMPTY_SYMBOL,'[');
    machine.addTransition(state2, state2, ']', '[', EMPTY_SYMBOL);
    machine.addTransition(state2, state3, EMPTY_SYMBOL, '$',EMPTY_SYMBOL);
    machine.setStartState(state1);
    machine.setFinalState(state3);

    test('machine accepts the empty string since start state is also final', () => 
    {
        expect(solvePDA(machine, '')).toBe(true);
    });

    //Test strings
    testSolvePDA(machine, '[]', true);
    testSolvePDA(machine, '[[][]]', true);
    testSolvePDA(machine, '[][]', true);
    testSolvePDA(machine, '[[]', false);
    testSolvePDA(machine, '[[[]][][]', false);
    testSolvePDA(machine, '[][][][', false);

});

describe('Testing PDA machine: \'10*\'', () => 
{
    const machine = new PDA();
    const state1 = machine.createState('q1');
    const state2 = machine.createState('q2');
    const state3 = machine.createState('q3');
    const state4 = machine.createState('q4');
    machine.addTransition(state1, state1,'0', EMPTY_SYMBOL, '0');
    machine.addTransition(state1, state1,'1',EMPTY_SYMBOL,'1');
    machine.addTransition(state1,state2, EMPTY_SYMBOL,EMPTY_SYMBOL, EMPTY_SYMBOL);
    machine.addTransition(state2, state2, '0','1','0');
    machine.addTransition(state2, state2,'1', '0','1');
    machine.addTransition(state2,state3, '0','1', EMPTY_SYMBOL);
    machine.addTransition(state2,state4, '0','0', EMPTY_SYMBOL);
    machine.setStartState(state1);
    machine.setFinalState(state3);

    test('machine accepts the empty string since start state is also final', () => 
    {
        expect(solvePDA(machine, '')).toBe(false);
    });

    //Test strings
    testSolvePDA(machine, '010', true);
    testSolvePDA(machine, '100', false);

});
