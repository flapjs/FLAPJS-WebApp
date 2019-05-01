import * as TEST from '../Tester.js';
import NFA from 'modules/fsa/machine/NFA.js';
import DFA from 'modules/fsa/machine/DFA.js';
import { minimizeFSA } from 'modules/fsa/machine/util/minimizeFSA.js';
import { isEquivalentFSA } from 'modules/fsa/machine/util/equalFSA.js';

{
    let machine = new DFA();
    machine.newState("q1");
    machine.newState("q2");
    machine.newState("q0");

    machine.newTransition("q1", "q0", "0");
    machine.newTransition("q1", "q2", "1");

    machine.newTransition("q2", "q2", "0");
    machine.newTransition("q2", "q2", "1");

    machine.newTransition("q0", "q2", "0");
    machine.newTransition("q0", "q1", "1");
    machine.setStartState("q0");
    machine.setFinalState("q0");
    machine = minimizeFSA(machine);

    let machine1 = new NFA();
    machine1.newState("q0")
    machine1.newState("q1")
    machine1.newTransition("q0", "q1", "1")
    machine1.newTransition("q1", "q0", "0")
    machine1.setStartState("q0")
    machine1.setFinalState("q0")
    machine1 = minimizeFSA(machine1)
    TEST.assertEquals(1, isEquivalentFSA(machine, machine1))
}

{
    let machine = new DFA();
    machine.newState("q0");
    machine.newState("q1");
    machine.newState("q2");
    machine.newTransition("q0", "q1", "0")
    machine.newTransition("q1", "q1", "0")
    machine.newTransition("q2", "q1", "0")
    machine = minimizeFSA(machine)
    TEST.assertEquals(1, machine._states.length);
}


{
    let machine = new DFA();
    machine.newState("q1");
    machine.newState("q2");
    machine.newState("q3");
    machine.newState("q4");
    machine.newState("q5");
    machine.newTransition("q1", "q3", "a")
    machine.newTransition("q1", "q2", "b")
    machine.newTransition("q2", "q4", "a")
    machine.newTransition("q2", "q1", "b")
    machine.newTransition("q3", "q5", "a")
    machine.newTransition("q3", "q4", "b")
    machine.newTransition("q4", "q4", "a")
    machine.newTransition("q4", "q4", "b")
    machine.newTransition("q5", "q3", "a")
    machine.newTransition("q5", "q2", "b")
    machine.setFinalState("q1");
    machine.setFinalState("q5");
    machine.setStartState("q1");
    machine = minimizeFSA(machine);

    let machine1 = new NFA();
    machine1.newState("q1")
    machine1.newState("q2")
    machine1.newState("q3")
    machine1.newTransition("q1", "q2", "b")
    machine1.newTransition("q1", "q3", "a")
    machine1.newTransition("q2", "q1", "b")
    machine1.newTransition("q3", "q1", "a")
    machine1.setFinalState("q1");
    machine1.setStartState("q1");
    machine1 = minimizeFSA(machine1);
    TEST.assertEquals(1, isEquivalentFSA(machine, machine1))
}

{
    let machine = new DFA();
    machine.newState("q1");
    machine = minimizeFSA(machine);
}
