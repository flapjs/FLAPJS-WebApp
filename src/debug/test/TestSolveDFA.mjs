import * as TEST from '../Tester.js';

import FSA from 'modules/fsa/machine/FSA.js';
import { solveFSA } from 'modules/fsa/machine/solveFSA.js';

//Regexpr: 1*
{
  const machine = new FSA(true);
  const state0 = machine.createState("q0");
  const state1 = machine.createState("q1");
  machine.addTransition(state0, state1, "0");
  machine.addTransition(state0, state0, "1");
  machine.addTransition(state1, state1, "0");
  machine.addTransition(state1, state1, "1");
  machine.setStartState(state0);
  machine.setFinalState(state0);

  //Make sure the DFA is a valid DFA
  TEST.assert(machine.validate(), "Machine is valid: " + machine.getErrors());

  //Should accept the empty string since start state is final state
  TEST.assertEquals(solveFSA(machine, ""), true, "Machine accepts the empty string.");

  TEST.out("Testing other input strings...");
  TEST.assertEquals(solveFSA(machine, "0"), false);
  TEST.assertEquals(solveFSA(machine, "1"), true);
  TEST.assertEquals(solveFSA(machine, "011111"), false);
  TEST.assertEquals(solveFSA(machine, "11010101"), false);
  TEST.assertEquals(solveFSA(machine, "1111"), true);
}
