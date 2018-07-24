import * as TEST from '../Tester.js';
import DFA from 'machine/DFA.js';
import NFA from 'machine/NFA.js';
import { EMPTY } from 'machine/Symbols.js';

import { solveDFA } from 'machine/util/solveDFA.js';
import { convertToDFA } from 'machine/util/convertNFA.js';

let nfa = new NFA();
let result = convertToDFA(nfa);
TEST.assert(result && result.validate(), "Empty machine is valid DFA.");

//Try simplest machine
TEST.out("Trying single state machine...");
let state0 = nfa.newState("q0");
nfa.newTransition(state0, state0, "0");
nfa.newTransition(state0, state0, "1");
result = convertToDFA(nfa);
TEST.assert(result && result.validate());

TEST.out("Checking for states...");
let states = result.getStates();
TEST.out("States: " + states);
TEST.assertEquals(1, states.length);
TEST.assert(result.hasState("{" + state0 + "}"));

TEST.out("Checking for alphabet...");
let alphabet = result.getAlphabet();
TEST.out("Alphabet: " + alphabet);
TEST.assertEquals(2, alphabet.length);
TEST.assert(alphabet.includes("0"));
TEST.assert(alphabet.includes("1"));

TEST.out("Checking for transitions...");
let transitions = result.getTransitions();
TEST.out("Transitions: " + transitions);
TEST.assertEquals("{" + state0 + "}", result.doTransition("{" + state0 + "}", "0"));
TEST.assertEquals("{" + state0 + "}", result.doTransition("{" + state0 + "}", "1"));

TEST.out("Trying another machine...");
let state1 = nfa.newState("q1");
nfa.newTransition(state0, state1, "1");
nfa.setFinalState(state1);
result = convertToDFA(nfa);
TEST.assert(result && result.validate());

TEST.out("Checking for states...");
states = result.getStates();
TEST.out("States: " + states);
TEST.out("StartState: " + result.getStartState());
TEST.out("FinalStates: " + result.getFinalStates());

TEST.out("Checking for alphabet...");
alphabet = result.getAlphabet();
TEST.out("Alphabet: " + alphabet);

TEST.out("Checking for transitions...");
transitions = result.getTransitions();
TEST.out("Transitions: " + transitions);

TEST.out("Testing by solving inputs...");
TEST.assert(!solveDFA(result, "0"));
TEST.assert(!solveDFA(result, ""));
TEST.assert(solveDFA(result, "1"));
TEST.assert(solveDFA(result, "111111111111"));
TEST.assert(solveDFA(result, "10000000001"));
TEST.assert(solveDFA(result, "0000000001"));
TEST.assert(solveDFA(result, "101010010010100101"));

TEST.out("Testing immediate moves...");
nfa.newTransition(state0, state1, EMPTY);
result = convertToDFA(nfa);
TEST.assert(result && result.validate());

TEST.out("Checking for states...");
states = result.getStates();
TEST.out("States: " + states);
TEST.out("StartState: " + result.getStartState());
TEST.out("FinalStates: " + result.getFinalStates());

TEST.out("Checking for alphabet...");
alphabet = result.getAlphabet();
TEST.out("Alphabet: " + alphabet);

TEST.out("Checking for transitions...");
transitions = result.getTransitions();
TEST.out("Transitions: " + transitions);

TEST.out("Testing by solving inputs...");
TEST.assert(solveDFA(result, "0"));
TEST.assert(solveDFA(result, ""));
TEST.assert(solveDFA(result, "1"));
TEST.assert(solveDFA(result, "111111111111"));
TEST.assert(solveDFA(result, "10000000001"));
TEST.assert(solveDFA(result, "0000000001"));
TEST.assert(solveDFA(result, "101010010010100101"));


/**NEW TEST*/
{
  let machine = new NFA();
  machine.newState("q0");
  machine.newState("q1");
  machine.newTransition("q0", "q1", "1");
  machine.setStartState("q0");
  machine.setFinalState("q0");
  let result = convertToDFA(machine);
  TEST.assert(result.validate());
}
