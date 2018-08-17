import * as TEST from '../Tester.js';

import NFA from 'machine/NFA.js';
import { EMPTY } from 'machine/Symbols.js';
import { solveNFA, solveNFAbyStep} from 'machine/util/solveNFA.js';

//Regex: 1*
let machine = new NFA();
let state0 = machine.newState("q0");
let state1 = machine.newState("q1");
machine.newTransition(state0, state1, "0");
machine.newTransition(state0, state0, "1");
machine.newTransition(state1, state1, "0");
machine.newTransition(state1, state1, "1");
machine.setStartState(state0);
machine.setFinalState(state0);

//Should accept the empty string since start state is final state
TEST.assertEquals(solveNFA(machine, ""), true, "Machine accepts the empty string.");

TEST.out("Testing DFA-like NFA machine...");
TEST.assertEquals(solveNFA(machine, "0"), false);
TEST.assertEquals(solveNFA(machine, "1"), true);
TEST.assertEquals(solveNFA(machine, "011111"), false);
TEST.assertEquals(solveNFA(machine, "11010101"), false);
TEST.assertEquals(solveNFA(machine, "1111"), true);

TEST.out("Testing NFA with immediate transitions...");
machine = new NFA();
state0 = machine.newState("q0");
state1 = machine.newState("q1");
let state2 = machine.newState("q2");
machine.newTransition(state0, state1, "0");
machine.newTransition(state0, state2, "1");
machine.newTransition(state1, state2, EMPTY);
machine.newTransition(state1, state0, EMPTY);
machine.newTransition(state1, state1, "0");
machine.newTransition(state1, state1, "1");
machine.setStartState(state0);
machine.setFinalState(state2);

//Should accept the empty string since start state is final state
TEST.assertEquals(solveNFA(machine, ""), false, "Machine rejects the empty string.");

TEST.out("Testing other input strings...");
TEST.assertEquals(solveNFA(machine, "0"), true);
TEST.assertEquals(solveNFA(machine, "1"), true);
TEST.assertEquals(solveNFA(machine, "011111"), true);
TEST.assertEquals(solveNFA(machine, "11010101"), false);
TEST.assertEquals(solveNFA(machine, "1111"), false);
