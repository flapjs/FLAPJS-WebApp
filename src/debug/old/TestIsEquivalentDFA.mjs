import * as TEST from '../Tester.js';
import DFA from 'machine/DFA.js';
import { EMPTY } from 'machine/Symbols.js';

import { isEquivalentFSA, isEquivalentDFA } from 'machine/util/equalFSA.js';

let dfa1 = new DFA();
let dfa2 = new DFA();

TEST.assertEquals(true, isEquivalentDFA(dfa1, dfa2), "Empty machines.");

//= accepts all strings
//Make first machine
dfa1.newState("q0");
dfa1.setFinalState("q0");

//Make second machine
dfa2.newState("q0");
dfa2.setFinalState("q0");

TEST.assertEquals(true, isEquivalentDFA(dfa1, dfa2), "Universal machines.");

dfa2.setFinalState("q0", false);

TEST.assertEquals(false, isEquivalentDFA(dfa1, dfa2), "Universal vs none machines.");

//= (aa)*
//Make first machine
dfa1.setFinalState("q0", false);
dfa1.newState("q1");
dfa1.newTransition("q0", "q1", "a");
dfa1.newTransition("q1", "q0", "a");
dfa1.setFinalState("q1");

//= (aa)*
//Make second machine
dfa2.newState("q1");
dfa2.newState("q2");
dfa2.newState("q3");
dfa2.newTransition("q0", "q1", "a");
dfa2.newTransition("q1", "q2", "a");
dfa2.newTransition("q2", "q3", "a");
dfa2.newTransition("q3", "q0", "a");
dfa2.setFinalState("q1");
dfa2.setFinalState("q3");

TEST.assertEquals(true, isEquivalentDFA(dfa1, dfa2), "(aa)* machines.");
TEST.assertEquals(true, isEquivalentFSA(dfa1, dfa2), "(aa)* machines.");

dfa2.setFinalState("q0");

TEST.assertEquals(false, isEquivalentDFA(dfa1, dfa2), "(a)* vs (aa)* machines.");

dfa1 = new DFA();
dfa2 = new DFA();

dfa1.newState("q0");
dfa1.newState("q1");
dfa1.newTransition("q0", "q1", "1");
dfa1.newTransition("q1", "q0", "1");
dfa1.setFinalState("q1");

dfa2.newState("q0");
dfa2.newState("q1");
dfa2.newTransition("q0", "q1", "a");
dfa2.newTransition("q1", "q0", "a");
dfa2.setFinalState("q1");

TEST.assertEquals(false, isEquivalentDFA(dfa1, dfa2), "a vs 1 machines.");
