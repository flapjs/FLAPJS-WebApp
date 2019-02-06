import PDA from 'machine/PDA.js'
import { EMPTY } from 'machine/Symbols.js';
import { solvePDA, solvePDAbyStep } from './solvePDA.js';

function testSolvePDA(machine, testString, expectedResult=true)
{
  test("test string \'" + testString + "\'", () => {
    expect(solvePDA(machine, testString)).toBe(expectedResult);
  });
}

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
});

/*describe("Testing DFA-like NFA machine: \'1*\'", () => {
  const machine = new FSA(false);
  const state0 = machine.createState("q0");
  const state1 = machine.createState("q1");
  machine.addTransition(state0, state1, "0");
  machine.addTransition(state0, state0, "1");
  machine.addTransition(state1, state1, "0");
  machine.addTransition(state1, state1, "1");
  machine.setStartState(state0);
  machine.setFinalState(state0);

  test("is a NFA machine type", () => {
    expect(machine.isDeterministic()).toBe(false);
  });
  test("is a valid NFA machine", () => {
    expect(machine.validate()).toBe(true);
    expect(machine.isValid()).toBe(true);
  });

  //Test strings
  testSolveFSA(machine, "", true);
  testSolveFSA(machine, "0", false);
  testSolveFSA(machine, "1", true);
  testSolveFSA(machine, "011111", false);
  testSolveFSA(machine, "11010101", false);
  testSolveFSA(machine, "1111", true);
});

describe("Testing NFA machine with immediate transitions", () => {
  const machine = new FSA();
  const state0 = machine.createState("q0");
  const state1 = machine.createState("q1");
  const state2 = machine.createState("q2");
  machine.addTransition(state0, state1, "0");
  machine.addTransition(state0, state2, "1");
  machine.addTransition(state1, state2, EMPTY_SYMBOL);
  machine.addTransition(state1, state0, EMPTY_SYMBOL);
  machine.addTransition(state1, state1, "0");
  machine.addTransition(state1, state1, "1");
  machine.setStartState(state0);
  machine.setFinalState(state2);

  test("is a NFA machine type", () => {
    expect(machine.isDeterministic()).toBe(false);
  });
  test("is a valid NFA machine", () => {
    expect(machine.validate()).toBe(true);
    expect(machine.isValid()).toBe(true);
  });

  //Test strings
  testSolveFSA(machine, "", false);
  testSolveFSA(machine, "0", true);
  testSolveFSA(machine, "1", true);
  testSolveFSA(machine, "011111", true);
  testSolveFSA(machine, "11010101", false);
  testSolveFSA(machine, "1111", false);
});

describe("Testing NFA machine step by step", () => {
  const machine = new FSA();
  const state0 = machine.createState("q0");
  const state1 = machine.createState("q1");
  const state2 = machine.createState("q2");
  machine.addTransition(state0, state1, "0");
  machine.addTransition(state0, state2, "1");
  machine.setFinalState(state2);

  test("test string \'0\'", () => {
    const cachedStates = [];
    const cachedSymbols = [];
    const startState = machine.getStartState();
    for(const currentState of machine.doClosureTransition(startState))
    {
      cachedStates.push({state: currentState, index: 0});
    }

    expect(startState.getStateLabel()).toBe("q0");
    expect(cachedStates).toHaveLength(1);
    expect(cachedStates[0].state.getStateLabel()).toBe("q0");

    let result = solveFSAByStep(machine, "0", cachedStates, cachedSymbols);

    expect(result).toBe(false);
    expect(cachedStates).toHaveLength(1);
    expect(cachedStates[0].state.getStateLabel()).toBe("q1");

    result = solveFSAByStep(machine, null, cachedStates, cachedSymbols);

    expect(result).toBe(false);
    expect(cachedStates).toHaveLength(0);
  });

  test("test string \'1\'", () => {
    const cachedStates = [];
    const cachedSymbols = [];
    const startState = machine.getStartState();
    for(const currentState of machine.doClosureTransition(startState))
    {
      cachedStates.push({state: currentState, index: 0});
    }

    expect(startState.getStateLabel()).toBe("q0");
    expect(cachedStates).toHaveLength(1);
    expect(cachedStates[0].state.getStateLabel()).toBe("q0");

    let result = solveFSAByStep(machine, "1", cachedStates, cachedSymbols);

    expect(result).toBe(false);
    expect(cachedStates).toHaveLength(1);
    expect(cachedStates[0].state.getStateLabel()).toBe("q2");

    result = solveFSAByStep(machine, null, cachedStates, cachedSymbols);

    expect(result).toBe(true);
    expect(cachedStates).toHaveLength(1);
    expect(cachedStates[0].state.getStateLabel()).toBe("q2");
  });
});*/
