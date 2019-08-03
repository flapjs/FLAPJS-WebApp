import FSA, { EMPTY_SYMBOL } from '../FSA.js';
import { solveFSA } from '../FSAUtils.js';

function createTestMachine()
{
  const dfa = new FSA(true);

  // Build DFA...
  // Example 1_38
  const q1 = dfa.createState("q1");
  const q2 = dfa.createState("q2");
  const q3 = dfa.createState("q3");
  const q4 = dfa.createState("q4");

  dfa.addTransition(q1,q1,"1");
  dfa.addTransition(q1,q1,"0");
  dfa.addTransition(q1,q2,"1");
  dfa.addTransition(q2,q3,"0");
  dfa.addTransition(q2,q3,EMPTY_SYMBOL);
  dfa.addTransition(q3,q4,"1");
  dfa.addTransition(q4,q4,"0");
  dfa.addTransition(q4,q4,"1");
  dfa.setFinalState(q4);

  return dfa;
}

describe("Example 1.38", () =>
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
    expect(dfa.getStartState().getStateLabel()).toBe("q1");
  });

  test("accepts '0001111111111'", () =>
  {
    let newDFA = createTestMachine();
    expect(solveFSA(dfa, "0001111111111")).toBe(true);
  });
  test("accepts '00011111111110001'", () =>
  {
    let newDFA = createTestMachine();
    expect(solveFSA(dfa, "00011111111110001")).toBe(true);
  });
});
