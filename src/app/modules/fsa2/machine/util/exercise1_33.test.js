import FSA, { EMPTY_SYMBOL } from '../FSA.js';
import { solveFSA } from '../FSAUtils.js';

function createTestMachine()
{
  const dfa = new FSA(true);

  // Build DFA...
  // Example 1_33
  const q0 = dfa.createState("q0");
  const q1 = dfa.createState("q1");
  const q2 = dfa.createState("q2");
  const q3 = dfa.createState("q3");
  const q4 = dfa.createState("q4");
  const q5 = dfa.createState("q5");

  dfa.addTransition(q0,q1,EMPTY_SYMBOL);
  dfa.addTransition(q0,q3,EMPTY_SYMBOL);
  dfa.addTransition(q1,q2,"0");
  dfa.addTransition(q2,q1,"0");
  dfa.addTransition(q3,q4,"0");
  dfa.addTransition(q4,q5,"0");
  dfa.addTransition(q5,q3,"0");
  dfa.setFinalState(q1);
  dfa.setFinalState(q3);

  return dfa;
}

describe("Example 1.33", () =>
{
  const dfa = createTestMachine();
  test("is a valid DFA", () =>
  {
    expect(dfa).toBeDefined();
    expect(dfa.validate()).toBe(true);
    expect(dfa.isValid()).toBe(true);
  });

  test("has correct start state", () =>
  {
    expect(dfa.getStartState().getStateLabel()).toBe("q0");
  });

  test("accepts ''", () =>
  {
    let newDFA = createTestMachine();
    expect(solveFSA(dfa, "00")).toBe(true);
  });
  test("accepts '00'", () =>
  {
    let newDFA = createTestMachine();
    expect(solveFSA(dfa, "00")).toBe(true);
  });
  test("accepts '000000000'", () =>
  {
    let newDFA = createTestMachine();
    expect(solveFSA(dfa, "000000000")).toBe(true);
  });
});
