import * as TEST from '../Tester.js';

import DFA from 'machine/DFA.js';
import { solveDFA } from 'machine/util/solveDFA.js';

//Regex: 1*
let machine = new DFA();
let state0 = machine.newState("q0");
let state1 = machine.newState("q1");
machine.newTransition(state0, state1, "0");
machine.newTransition(state0, state0, "1");
machine.newTransition(state1, state1, "0");
machine.newTransition(state1, state1, "1");
machine.setStartState(state0);
machine.setFinalState(state0);

//Make sure the DFA is a valid DFA
TEST.assert(machine.validate(), "Machine is valid.");

//Should accept the empty string since start state is final state
TEST.assertEquals(solveDFA(machine, ""), true, "Machine accepts the empty string.");

TEST.out("Testing other input strings...");
TEST.assertEquals(solveDFA(machine, "0"), false);
TEST.assertEquals(solveDFA(machine, "1"), true);
TEST.assertEquals(solveDFA(machine, "011111"), false);
TEST.assertEquals(solveDFA(machine, "11010101"), false);
TEST.assertEquals(solveDFA(machine, "1111"), true);
