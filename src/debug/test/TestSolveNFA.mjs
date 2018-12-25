import * as TEST from '../Tester.js';

import FSA, { EMPTY_SYMBOL } from 'modules/fsa/machine/FSA.js';
import { solveFSA } from 'modules/fsa/machine/solveFSA.js';

//Regex: 1*
{
  const machine = new FSA(false);
  const state0 = machine.createState("q0");
  const state1 = machine.createState("q1");
  machine.addTransition(state0, state1, "0");
  machine.addTransition(state0, state0, "1");
  machine.addTransition(state1, state1, "0");
  machine.addTransition(state1, state1, "1");
  machine.setStartState(state0);
  machine.setFinalState(state0);

  //Should accept the empty string since start state is final state
  TEST.assertEquals(solveFSA(machine, ""), true, "Machine accepts the empty string.");

  TEST.out("Testing DFA-like NFA machine...");
  TEST.assertEquals(solveFSA(machine, "0"), false);
  TEST.assertEquals(solveFSA(machine, "1"), true);
  TEST.assertEquals(solveFSA(machine, "011111"), false);
  TEST.assertEquals(solveFSA(machine, "11010101"), false);
  TEST.assertEquals(solveFSA(machine, "1111"), true);
}

{
  TEST.out("Testing NFA with immediate transitions...");
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

  //Should accept the empty string since start state is final state
  TEST.assertEquals(solveFSA(machine, ""), false, "Machine rejects the empty string.");

  TEST.out("Testing other input strings...");
  TEST.assertEquals(solveFSA(machine, "0"), true);
  TEST.assertEquals(solveFSA(machine, "1"), true);
  TEST.assertEquals(solveFSA(machine, "011111"), true);
  TEST.assertEquals(solveFSA(machine, "11010101"), false);
  TEST.assertEquals(solveFSA(machine, "1111"), false);
}
