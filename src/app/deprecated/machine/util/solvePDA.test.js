import PDA from '../PDA.js'
import { EMPTY } from 'deprecated/fsa/machine/Symbols.js';
import { solvePDA, solvePDAbyStep } from './solvePDA.js';

function testSolvePDA(machine, testString, expectedResult=true)
{
  test("test string \'" + testString + "\'", () => {
    expect(solvePDA(machine, testString)).toBe(expectedResult);
  });
}

//Machine acceptes n 0 infornt of n 1
describe("Testing PDA machine: \'1*\'", () => {
  const machine = new PDA();
  const state4 = machine.newState("q4");
  const state1 = machine.newState("q1");
  const state2 = machine.newState("q2");
  const state3 = machine.newState("q3");
  machine.newTransition(state1,EMPTY, state2,EMPTY,"$");
  machine.newTransition(state2,"0",state2, EMPTY, "0");
  machine.newTransition(state2,"1", state3,"0",EMPTY);
  machine.newTransition(state3,"1", state3, "0",EMPTY);
  machine.newTransition(state3,EMPTY, state4, "$",EMPTY);
  machine.setStartState(state1);
  machine.setFinalState(state1);
  machine.setFinalState(state4);

  test("machine accepts the empty string since start state is also final", () => {
    expect(solvePDA(machine, "")).toBe(true);
  });

  //Test strings
  testSolvePDA(machine, "0", false);
  testSolvePDA(machine, "1", false);
  testSolvePDA(machine, "011111", false);
  testSolvePDA(machine, "11010101", false);
  testSolvePDA(machine, "1111", false);
  testSolvePDA(machine, "0011", true);
  testSolvePDA(machine, "01", true);
  testSolvePDA(machine, "000111", true);
});

//machine accept string with at least three 1's
describe("Testing PDA machine: \'2*\'", () => {
  const machine = new PDA();
  const state1 = machine.newState("q1");
  const state2 = machine.newState("q2");
  const state3 = machine.newState("q3");
  const state4 = machine.newState("q4");
  machine.newTransition(state1,"0", state1, EMPTY, EMPTY)
  machine.newTransition(state1,"1", state2,EMPTY,EMPTY);
  machine.newTransition(state2,"0",state2, EMPTY, EMPTY);
  machine.newTransition(state2,"1", state3,EMPTY,EMPTY);
  machine.newTransition(state3,"0", state3,EMPTY,EMPTY);
  machine.newTransition(state3,"1", state4, EMPTY,EMPTY);
  machine.newTransition(state4,"0", state4, EMPTY,EMPTY)
  machine.newTransition(state4,"1", state4, EMPTY,EMPTY)
  machine.setStartState(state1);
  machine.setFinalState(state4);

  test("machine accepts the empty string since start state is also final", () => {
    expect(solvePDA(machine, "")).toBe(false);
  });

  //Test strings
  testSolvePDA(machine, "0", false);
  testSolvePDA(machine, "1", false);
  testSolvePDA(machine, "01010", false);
  testSolvePDA(machine, "000", false);
  testSolvePDA(machine, "000111", true);
  testSolvePDA(machine, "0001", false);

});

//machine accept palindroms with odd length
describe("Testing PDA machine: \'3*\'", () => {
  const machine = new PDA();
  const state1 = machine.newState("q1");
  const state2 = machine.newState("q2");
  const state3 = machine.newState("q3");
  const state4 = machine.newState("q4");
  machine.newTransition(state1,EMPTY, state2, EMPTY, "$")
  machine.newTransition(state2,"0", state2,EMPTY,"0");
  machine.newTransition(state2,"1",state2, EMPTY, "1");
  machine.newTransition(state2,"1", state3,EMPTY,EMPTY);
  machine.newTransition(state2,"0", state3,EMPTY,EMPTY);
  machine.newTransition(state3,"1", state3, "1",EMPTY);
  machine.newTransition(state3,"0", state3, "0",EMPTY)
  machine.newTransition(state3,EMPTY, state4, "$",EMPTY)
  machine.setStartState(state1);
  machine.setFinalState(state4);

  test("machine accepts the empty string since start state is also final", () => {
    expect(solvePDA(machine, "")).toBe(false);
  });

  //Test strings
  testSolvePDA(machine, "0", true);
  testSolvePDA(machine, "1", true);
  testSolvePDA(machine, "01010", true);
  testSolvePDA(machine, "000", true);
  testSolvePDA(machine, "000111", false);
  testSolvePDA(machine, "0001", false);
  testSolvePDA(machine, "0110", false);


});


//machine accept palindroms
describe("Testing PDA machine: \'4*\'", () => {
  const machine = new PDA();
  const state1 = machine.newState("q1");
  const state2 = machine.newState("q2");
  const state3 = machine.newState("q3");
  const state4 = machine.newState("q4");
  machine.newTransition(state1,EMPTY, state2, EMPTY, "$")
  machine.newTransition(state2,"0", state2,EMPTY,"0");
  machine.newTransition(state2,"1",state2, EMPTY, "1");
  machine.newTransition(state2,"1", state3,EMPTY,EMPTY);
  machine.newTransition(state2,"0", state3,EMPTY,EMPTY);
  machine.newTransition(state2,EMPTY, state3,EMPTY,EMPTY);
  machine.newTransition(state3,"1", state3, "1",EMPTY);
  machine.newTransition(state3,"0", state3, "0",EMPTY)
  machine.newTransition(state3,EMPTY, state4, "$",EMPTY)
  machine.setStartState(state1);
  machine.setFinalState(state4);
  machine.setFinalState(state1);

  test("machine accepts the empty string since start state is also final", () => {
    expect(solvePDA(machine, "")).toBe(true);
  });

  //Test strings
  testSolvePDA(machine, "0", true);
  testSolvePDA(machine, "1", true);
  testSolvePDA(machine, "01010", true);
  testSolvePDA(machine, "000", true);
  testSolvePDA(machine, "000111", false);
  testSolvePDA(machine, "0001", false);
  testSolvePDA(machine, "0110", true);
});


//machine language is empty
describe("Testing PDA machine: \'5*\'", () => {
  const machine = new PDA();
  const state1 = machine.newState("q1");
  machine.setStartState(state1);

  test("machine accepts the empty string since start state is also final", () => {
    expect(solvePDA(machine, "")).toBe(false);
  });

  //Test strings
  testSolvePDA(machine, "0", false);
  testSolvePDA(machine, "1", false);
  testSolvePDA(machine, "01010", false);
  testSolvePDA(machine, "000", false);
  testSolvePDA(machine, "000111", false);
  testSolvePDA(machine, "0001", false);
  testSolvePDA(machine, "0110", false);
});

//machine accept a^i b^j c^k and i = j or j = k
describe("Testing PDA machine: \'6*\'", () => {
  const machine = new PDA();
  const state1 = machine.newState("q1");
  const state2 = machine.newState("q2");
  const state3 = machine.newState("q3");
  const state4 = machine.newState("q4");
  const state5 = machine.newState("q5");
  const state6 = machine.newState("q6");
  const state7 = machine.newState("q7");
  const state8 = machine.newState("q8");
  machine.newTransition(state1,EMPTY, state2, EMPTY, "$")
  machine.newTransition(state1,EMPTY, state5, EMPTY, "$")
  machine.newTransition(state2,"a", state2,EMPTY,"a");
  machine.newTransition(state2,EMPTY,state3, EMPTY, EMPTY);
  machine.newTransition(state3,"b", state3,"a",EMPTY);
  machine.newTransition(state3,EMPTY, state4,"$",EMPTY);
  machine.newTransition(state4,"c", state4,EMPTY,EMPTY);
  machine.newTransition(state5,"a", state5,EMPTY,EMPTY);
  machine.newTransition(state5,EMPTY,state6, EMPTY, EMPTY);
  machine.newTransition(state6,"b", state6,EMPTY,"b");
  machine.newTransition(state6,EMPTY, state7,EMPTY,EMPTY);
  machine.newTransition(state7,"c", state7,"b",EMPTY);
  machine.newTransition(state7,EMPTY, state8,"$",EMPTY);
  machine.setStartState(state1);
  machine.setFinalState(state4);
  machine.setFinalState(state8);

  test("machine accepts the empty string since start state is also final", () => {
    expect(solvePDA(machine, "")).toBe(true);
  });

  //Test strings
  testSolvePDA(machine, "aabb", true);
  testSolvePDA(machine, "bbcc", true);
  testSolvePDA(machine, "abc", true);
  testSolvePDA(machine, "cab", false);
  testSolvePDA(machine, "abbcc", true);
  testSolvePDA(machine, "b", false);
  testSolvePDA(machine, "a", true);
});

//a^i b^j c^k i,j,k >= 0 and i +j = k
describe("Testing PDA machine: \'7*\'", () => {
  const machine = new PDA();
  const state1 = machine.newState("q1");
  const state2 = machine.newState("q2");
  const state3 = machine.newState("q3");
  const state4 = machine.newState("q4");
  const state5 = machine.newState("q5");
  machine.newTransition(state1,EMPTY, state2, EMPTY, "$")
  machine.newTransition(state2,"a", state2,EMPTY,"x");
  machine.newTransition(state2,EMPTY, state3,EMPTY,EMPTY);
  machine.newTransition(state3,"b", state3, EMPTY,"x");
  machine.newTransition(state3,EMPTY, state4, EMPTY,EMPTY)
  machine.newTransition(state4,"c", state4, "x",EMPTY)
  machine.newTransition(state4,EMPTY, state5, "$",EMPTY)
  machine.setStartState(state1);
  machine.setFinalState(state5);

  test("machine accepts the empty string since start state is also final", () => {
    expect(solvePDA(machine, "")).toBe(true);
  });

  //Test strings
  testSolvePDA(machine, "abcc", true);
  testSolvePDA(machine, "aacc", true);
  testSolvePDA(machine, "bbcc", true);
  testSolvePDA(machine, "bc", true);
  testSolvePDA(machine, "abc", false);
  testSolvePDA(machine, "ac", true);
  testSolvePDA(machine, "accb", false);
});


//a^2n b^3n
describe("Testing PDA machine: \'8*\'", () => {
  const machine = new PDA();
  const state1 = machine.newState("q1");
  const state2 = machine.newState("q2");
  const state3 = machine.newState("q3");
  const state4 = machine.newState("q4");
  const state5 = machine.newState("q5");
  const state6 = machine.newState("q6");
  const state7 = machine.newState("q7");
  machine.newTransition(state1,EMPTY, state2, EMPTY, "$")
  machine.newTransition(state2,"a", state3,EMPTY,EMPTY);
  machine.newTransition(state3,"a", state2,EMPTY,"x");
  machine.newTransition(state2,EMPTY, state4, EMPTY,EMPTY);
  machine.newTransition(state4,"b", state5, EMPTY,EMPTY)
  machine.newTransition(state5,"b", state6,EMPTY,EMPTY)
  machine.newTransition(state6,"b", state4, "x",EMPTY)
  machine.newTransition(state4,EMPTY, state7, "$",EMPTY)
  machine.setStartState(state1);
  machine.setFinalState(state7);

  test("machine accepts the empty string since start state is also final", () => {
    expect(solvePDA(machine, "")).toBe(true);
  });

  //Test strings
  testSolvePDA(machine, "aabbb", true);
  testSolvePDA(machine, "abb", false);
  testSolvePDA(machine, "bbcc", false);
  testSolvePDA(machine, "bc", false);
  testSolvePDA(machine, "ab", false);
  testSolvePDA(machine, "aaaabbbbbb", true);
});


describe("Testing PDA machine: \'9*\'", () => {
  const machine = new PDA();
  const state1 = machine.newState("q1");
  const state2 = machine.newState("q2");
  const state3 = machine.newState("q3");
  machine.newTransition(state1,EMPTY, state2, EMPTY, "$")
  machine.newTransition(state2,"[", state2,EMPTY,"[");
  machine.newTransition(state2,"]",state2, "[", EMPTY);
  machine.newTransition(state2,EMPTY, state3, "$",EMPTY)
  machine.setStartState(state1);
  machine.setFinalState(state3);

  test("machine accepts the empty string since start state is also final", () => {
    expect(solvePDA(machine, "")).toBe(true);
  });

  //Test strings
  testSolvePDA(machine, "[]", true);
  testSolvePDA(machine, "[[][]]", true);
  testSolvePDA(machine, "[][]", true);
  testSolvePDA(machine, "[[]", false);
  testSolvePDA(machine, "[[[]][][]", false);
  testSolvePDA(machine, "[][][][", false);

});


describe("Testing PDA machine: \'10*\'", () => {
  const machine = new PDA();
  const state1 = machine.newState("q1");
  const state2 = machine.newState("q2");
  const state3 = machine.newState("q3");
  const state4 = machine.newState("q4");
  machine.newTransition(state1,"0", state1, EMPTY, "0")
  machine.newTransition(state1,"1", state1,EMPTY,"1");
  machine.newTransition(state1,EMPTY,state2, EMPTY, EMPTY);
  machine.newTransition(state2,"0", state2, "1","0")
  machine.newTransition(state2,"1", state2, "0","1")
  machine.newTransition(state2,"0",state3, "1", EMPTY);
  machine.newTransition(state2,"0",state4, "0", EMPTY);
  machine.setStartState(state1);
  machine.setFinalState(state3);

  test("machine accepts the empty string since start state is also final", () => {
    expect(solvePDA(machine, "")).toBe(false);
  });

  //Test strings
  testSolvePDA(machine, "010", true);

});
