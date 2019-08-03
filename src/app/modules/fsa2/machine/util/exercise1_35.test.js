import FSA, { EMPTY_SYMBOL } from '../FSA.js';
import { solveFSA } from '../FSAUtils.js';

function createTestMachine()
{
  const dfa = new FSA(true);

  // Build DFA...
  // Example 1_35
  const q1 = dfa.createState("q1");
  const q2 = dfa.createState("q2");
  const q3 = dfa.createState("q3");


  dfa.addTransition(q1,q2,"b");
  dfa.addTransition(q2,q2,"a");
  dfa.addTransition(q2,q3,"a");
  dfa.addTransition(q2,q3,"b");
  dfa.addTransition(q3,q1,"a");
  dfa.addTransition(q1,q3,EMPTY_SYMBOL);
  dfa.setFinalState(q1);

  return dfa;
}

describe("Example 1.35", () =>
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

  test("accepts 'aaaabb'", () =>
  {
    let newDFA = createTestMachine();
    expect(solveFSA(dfa, "aaaabb")).toBe(true);
  });
  test("accepts 'bbbba'", () =>
  {
    let newDFA = createTestMachine();
    expect(solveFSA(dfa, "bbbba")).toBe(true);
  });
});
