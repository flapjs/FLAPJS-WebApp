import * as TEST from '../Tester.js';

import FSA, { EMPTY_SYMBOL } from 'modules/fsa/machine/FSA.js';
import { solveFSA } from 'modules/fsa/machine/solveFSA.js';
import { convertToDFA } from 'modules/fsa/machine/convertFSA.js';

{
  TEST.out("Trying to convert an empty NFA machine...");
  const nfa = new FSA(false);
  const dfa = convertToDFA(nfa, nfa);
  TEST.assert(dfa && dfa.validate(), "Empty machine is valid DFA.");
}

{
  //Try simplest machine
  TEST.out("Trying single state machine...");
  const nfa = new FSA(false);
  const state0 = nfa.createState("q0");
  nfa.addTransition(state0, state0, "0");
  nfa.addTransition(state0, state0, "1");
  const dfa = convertToDFA(nfa, nfa);
  const trapStates = nfa.getStatesByLabel("{}");
  TEST.assert(trapStates && trapStates.length == 1, "Trap state exists.");
  const trapState = trapStates[0];
  TEST.out(dfa.getTransitions());
  TEST.assert(dfa && dfa.validate(), dfa.getErrors());

  TEST.out("Checking for states...");
  const states = Array.from(dfa.getStates());
  TEST.out("States:", states);
  TEST.assertEquals(2, states.length);
  TEST.assert(dfa.hasStateWithLabel("{q0}"));

  TEST.out("Checking for alphabet...");
  const alphabet = Array.from(dfa.getAlphabet());
  TEST.out("Alphabet:", alphabet);
  TEST.assertEquals(2, alphabet.length);
  TEST.assert(alphabet.includes("0"));
  TEST.assert(alphabet.includes("1"));

  TEST.out("Checking for transitions...");
  const transitions = dfa.getTransitions();
  TEST.out("Transitions:", transitions);
  let q0 = dfa.getStatesByLabel("{q0}");
  TEST.assert(q0.length == 1);
  q0 = q0[0];
  let result = dfa.doTransition(q0, "0");
  TEST.assert(result.length == 1);
  TEST.assert(result[0].getStateLabel() == "{q0}");
  result = dfa.doTransition(q0, "1");
  TEST.assert(result.length == 1);
  TEST.assert(result[0].getStateLabel() == "{q0}");
}

{
  TEST.out("Trying another machine...");
  const nfa = new FSA(false);
  const state0 = nfa.createState("q0");
  const state1 = nfa.createState("q1");
  nfa.addTransition(state0, state0, "0");
  nfa.addTransition(state0, state0, "1");
  nfa.addTransition(state0, state1, "1");
  nfa.setFinalState(state1);
  const result = convertToDFA(nfa, nfa);
  TEST.assert(result && result.validate(), result.getErrors());

  TEST.out("Checking for states...");
  const states = result.getStates();
  TEST.out("States:", states);
  TEST.out("StartState:", result.getStartState());
  TEST.out("FinalStates:", result.getFinalStates());

  TEST.out("Checking for alphabet...");
  const alphabet = result.getAlphabet();
  TEST.out("Alphabet:", alphabet);

  TEST.out("Checking for transitions...");
  const transitions = result.getTransitions();
  TEST.out("Transitions:", transitions);

  TEST.out("Testing by solving inputs...");
  TEST.assert(!solveFSA(result, "0"));
  TEST.assert(!solveFSA(result, ""));
  TEST.assert(solveFSA(result, "1"));
  TEST.assert(solveFSA(result, "111111111111"));
  TEST.assert(solveFSA(result, "10000000001"));
  TEST.assert(solveFSA(result, "0000000001"));
  TEST.assert(solveFSA(result, "101010010010100101"));
}

{
  TEST.out("Testing immediate moves...");
  const nfa = new FSA(false);
  const state0 = nfa.createState("q0");
  const state1 = nfa.createState("q1");
  nfa.addTransition(state0, state0, "0");
  nfa.addTransition(state0, state0, "1");
  nfa.addTransition(state0, state1, "1");
  nfa.addTransition(state0, state1, EMPTY_SYMBOL);
  nfa.setFinalState(state1);
  const result = convertToDFA(nfa, nfa);
  TEST.assert(result && result.validate());

  TEST.out("Checking for states...");
  const states = result.getStates();
  TEST.out("States:", states);
  TEST.out("StartState:", result.getStartState());
  TEST.out("FinalStates:", result.getFinalStates());

  TEST.out("Checking for alphabet...");
  const alphabet = result.getAlphabet();
  TEST.out("Alphabet:", alphabet);

  TEST.out("Checking for transitions...");
  const transitions = result.getTransitions();
  TEST.out("Transitions:", transitions);

  TEST.out("Testing by solving inputs...");
  TEST.assert(solveFSA(result, "0"));
  TEST.assert(solveFSA(result, ""));
  TEST.assert(solveFSA(result, "1"));
  TEST.assert(solveFSA(result, "111111111111"));
  TEST.assert(solveFSA(result, "10000000001"));
  TEST.assert(solveFSA(result, "0000000001"));
  TEST.assert(solveFSA(result, "101010010010100101"));
}

{
  TEST.out("Trying recursive test...");
  const machine = new FSA();
  const state0 = machine.createState("q0");
  const state1 = machine.createState("q1");
  machine.addTransition(state0, state1, "1");
  machine.addTransition(state1, state0, "0");
  machine.setStartState(state0);
  machine.setFinalState(state0);
  const result = convertToDFA(machine, machine);
  TEST.assert(result && result.validate());
}
