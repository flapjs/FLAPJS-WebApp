import FSA, { EMPTY_SYMBOL } from '../FSA.js';
import { isEquivalentFSA, isEquivalentDFA } from '../FSAUtils.js';

describe("Testing equivalency between empty DFA machines", () => {
  const dfa1 = new FSA(true);
  const dfa2 = new FSA(true);
  test("is DFA equivalent", () => {
    const result = isEquivalentDFA(dfa1, dfa2);
    expect(result).toBe(true);
  });
  test("is FSA equivalent", () => {
    const result = isEquivalentFSA(dfa1, dfa2);
    expect(result).toBe(true);
  });
});

describe("Testing equivalency between itself", () => {
  const fsa1 = new FSA(true);
  let q0 = fsa1.createState("q0");
  let q1 = fsa1.createState("q1");
  fsa1.setFinalState(q1);
  fsa1.addTransition(q0, q1, "0");

  test("is FSA equivalent", () => {
    const result = isEquivalentFSA(fsa1, fsa1);
    expect(result).toBe(true);
  });
});

describe("Testing equivalency between non-empty FSA machines", () => {
  const fsa1 = new FSA(true);
  let q0 = fsa1.createState("q0");
  let q1 = fsa1.createState("q1");
  fsa1.setFinalState(q1);
  fsa1.addTransition(q0, q1, "0");

  const fsa2 = new FSA(false);
  q0 = fsa2.createState("q0");
  q1 = fsa2.createState("q1");
  fsa2.setFinalState(q1);
  fsa2.addTransition(q0, q1, "0");

  const fsa3 = new FSA(false);
  q0 = fsa3.createState("q0");
  q1 = fsa3.createState("q1");
  fsa3.setFinalState(q1);
  fsa3.addTransition(q0, q1, "1");

  test("is similar FSA equivalent", () => {
    const result = isEquivalentFSA(fsa1, fsa2);
    expect(result).toBe(true);
  });

/*
  test("is different symbol FSA equivalent", () => {
    const result = isEquivalentFSA(fsa1, fsa3);
    expect(result).toBe(false);
  });
*/

});
