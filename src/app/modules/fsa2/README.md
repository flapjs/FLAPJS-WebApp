# Finite Automata
This is a Flap.js module for finite automata, also named FA or FSA, and is initially made for CSE 105 Theory of Computation at UC San Diego. For more information about finite automata, refer to the [theory](#theories) explained below.

## Motivation
The FSA module will allow users to define finite automata and analyze them. Users will be able to explore and debug different constructions as they are built over time through testing, conversion, editing, and exporting. 

## Goals
- [x] FSA Module
- [x] FSA Machine
    - [x] MachineController
    - [x] Deterministic Finite Automata
    - [x] Nondeterministic Finite Automata
- [x] FSA Graph
    - [x] GraphController
    - [x] LabelEditor
- [x] Exporting / Importing FSA
    - [x] Exporting / Importing FSA for file
    - [x] Exporting / Importing FSA for .jff
    - [x] Exporting FSA for images
- [x] Analyzable view of FSA definition
    - [x] States (Q)
    - [x] Alphabet (&#x3a3;)
    - [x] Transition Function (&#x3B4;)
    - [x] Start State (q0)
    - [x] Final States (F)
- [x] Editable form for defining FSAs
- [x] NFA to DFA conversion
    - [x] DFA to NFA conversion (should be pretty easy though)
- [x] FSA string testing
- [ ] FSA equivalence testing
- [ ] FSA minimization
- [ ] FSA computation tree

## Entrypoints
The class FSAModule.js is the main entrypoint. From here, any setup and cleanup are performed here or further delegated to other classes.

The class FSA.js is used to represent the accurate and valid model of a finite automata. By default, it is defined as nondeterministic. Use setDeterministic() to change it to a DFA. Although this makes a machine to be recognized as a DFA, it may not be valid since it does not convert the machine if the change occurs from NFA to DFA.

The class FSAGraph.js is used to represent the graphical reprsentation of the machine. Instead of State and Transition, it uses Node and Edge respectively.

## Don'ts & Dangers
- TODO: PUT DANGERS HERE!

## Theories
If you are at UCSD, please refer to CSE 105 Theory of Computation for more detailed information.
Otherwise, the recommended text is __Introduction to the Theory of Computation__ by Michael Sipser. The project has used both 2nd and 3rd edition and will be following as closely as possible to their format.

### Finite Automata
A finite automata is a type of machine that is made up of a sequence of states (graphically a "node"), starting with the initital (or start) state, determined by transitions (graphically an "edge") as it reads successive input states.

It is defined by a 5-tuple *M = (Q, &#x3a3;, &#x3B4;, q0, F)*:
- Q => States, a finite set of states
- &#x3a3; => Alphabet, a finite set of symbols
- &#x3B4; : Q &#x2a2f; &#x3a3; -> Q => Transition function, a function that maps a state and a symbol to another state (can be the same one)
- q0 &#x2208; Q => Start state, the state that starts the sequence
- F &#x2286; Q => Accept states, a set of accept states

#### Deterministic Finite Automata
A deterministic finite automata a FA (finite automata) that is used to determine whether a string of symbols should be accepted or rejected, given any state and the following input symbol. To achieve this, a valid DFA (deterministic finite automata) must be well-defined. In other words, every state must have one outgoing transition for every one symbol of the alphabet.

#### Nondeterministic Finite Automata
A nondeterministic finite automata is a type of machine that similarly computes whether a string is accepted or rejected, but cannot be determined solely from a single state. Further information is required to determine the "state" of the machine, therefore it is nondeterministic (as opposed to deterministic). This is because the FA no longer has to be well-defined. Multiple transitions can be missing or even share the same input symbol from the same source state. In addition, a NFA can use empty transitions that immediately moves from one state to another without reading (moving to the next) input symbols.

### Converting between DFA and NFA
Deterministic finite automata and nondeterministic finite automata actually have the same expressive power; for every machine of either type, it can be constructed in the other. For conversion towards an NFA, this is trivial, since every DFA is already a valid NFA. However, since a DFA must be well-defined and cannot utilize empty transitions, a conversion from NFA to DFA is much more interesting. Here is a basic rundown of the algorithm:

1. TODO: PUT DOWN THE THEORY HERE!

## Ideas
### FSA class
FSA.js contains two classes: State and Transition.

State represents a state of the machine. It has a label, which is the name for the state, and a source, from where the state is created from if derived. The name does not have to be unique. If you need a unique identifier, use its generated id from getStateID().

Transition represents a transition or a group of transitions that move from one state to another in the machine. It has a source and destination state and also an array of symbols that it can read. As such, a Transition object is not a "one-to-one" representation of a finite automata transition. A single Transition object could represent more than one "transition", but they must have the same source and destination states. Similarly to State, if you need a unique identifier, use its generated id from getTransitionID().

NOTE: Although currently not yet tested, it is theoretically not *required* that symbols are single characters.

To create and add states and transitions, use their respective construction functions createState() and addTransition(). If you want finer control over state creation, you can use addState(). No such alternative exists for Transitions however.

### ConvertFSA

The conversion algorithm is the same as described [above](#converting-between-dfa-and-nfa).

## Changelog

**5/20/19 - Andrew:**
This is the first entry for the FSA module. However, much has been done before this point as the module is currently on version 3.0.0. With its first version completed about a year ago, it may be impossible to recover all the changes that this module has undergone. Hopefully, when new updates are made for this module, its contents will slowly become more documented and refined. I will try my best to flesh out anything confusing from the past, but I am just a human like you. To the features I've missed, I wish you the best of luck.
