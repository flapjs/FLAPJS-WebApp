import FSA, { EMPTY_SYMBOL } from '../FSA.js';
import { solveFSA } from '../FSAUtils.js';

function createTestMachine()
{
  const dfa = new FSA(true);

  // Build DFA...
  // Example 1_16_b
  const q3 = dfa.createState("1");
  const q1 = dfa.createState("2");
  const q2 = dfa.createState("3");
  dfa.addTransition(q1,q2,EMPTY_SYMBOL);
  dfa.addTransition(q2,q1,"a");
  dfa.addTransition(q1,q3,"a");
  dfa.addTransition(q3,q2,"a");
  dfa.addTransition(q3,q2,"b");
  dfa.addTransition(q3,q3,"b");
  dfa.setFinalState(q2);

  return dfa;
}

describe("Exercise 1.16.b", () =>
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
    expect(dfa.getStartState().getStateLabel()).toBe("1");
  });

  test("accepts ''", () =>
  {
    let newDFA = createTestMachine();
    expect(solveFSA(dfa, "")).toBe(true);
  });
  test("accepts 'aaaaaaabbaaaaaabb'", () =>
  {
    let newDFA = createTestMachine();
    expect(solveFSA(dfa, "aaaaaaabbaaaaaabb")).toBe(true);
  });
});
