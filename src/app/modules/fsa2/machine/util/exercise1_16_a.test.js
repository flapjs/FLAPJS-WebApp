import FSA, { EMPTY_SYMBOL } from '../FSA.js';
import { solveFSA } from '../FSAUtils.js';

function createTestMachine()
{
  const dfa = new FSA(true);

  // Build DFA...
  // Example 1_16_a
  const q1 = dfa.createState("q1");
  const q2 = dfa.createState("q2");
  dfa.addTransition(q1,q1,"a");
  dfa.addTransition(q1,q2,"a");
  dfa.addTransition(q1,q2,"b");
  dfa.addTransition(q2,q1,"b");
  dfa.setFinalState(q1);

  return dfa;
}

describe("Exercise 1.16.a () => {

}", () =>
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
