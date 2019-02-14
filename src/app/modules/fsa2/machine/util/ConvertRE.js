import FSA, {EMPTY_SYMBOL} from '../FSA.js';
import {EMPTY,
  CONCAT,
	UNION,
	KLEENE} from '../RE.js';

import REParser from '../REParser.js';

// Return NFA representation of the input regular expression
// Construction of NFA is done using Thompson's algorithm
export function convertToNFA(re)
{
	const parser = new REParser();
	parser.parseRegex(re);
	const nfa = ASTtoNFA(parser.rootNode);
  return nfa;
}

function ASTtoNFA(astNode)
{
	//Base case, terminal nodes are characters in the alphabet
	if (astNode.isTerminal())
	{
		return character(astNode.getSymbol());
	}
	switch (astNode.getSymbol())
	{
	case KLEENE:
		return kleene(ASTtoNFA(astNode._children[0]));
	case CONCAT:
		return concat(ASTtoNFA(astNode._children[0]), ASTtoNFA(astNode._children[1]));
	case UNION:
		return or(ASTtoNFA(astNode._children[0]), ASTtoNFA(astNode._children[1]));
	case '(':
		return ASTtoNFA(astNode._children[0])
	default:
		throw new Error("You've got a weird node in the AST tree with symbol " + astNode.getSymbol());
	}
}

// For a symbol of the alphabet, the NFA is two states, a start and a finish state,
// with the transition being the symbol.
function character(symbol)
{
	const result = new FSA(false);
	const state0 = result.createState("q0");
	const state1 = result.createState("q1");
	result.addTransition(state0, state1, symbol);
	result.setStartState(state0);
	result.setFinalState(state1);
	return result;
}

function concat(a, b)
{
	const result = new FSA(false);
  let stateIndex = 0;

  let aStateMap = new Map();
  let firstAState = null;
  let lastAState = null;
  for(const state of a.getStates())
  {
    let newState = result.createState("q" + (stateIndex++));
    aStateMap.set(state, newState);
    if (firstAState === null) firstAState = newState;
    lastAState = newState;
  }

  let bStateMap = new Map();
  let firstBState = null;
  let lastBState = null;
  for(const state of b.getStates())
  {
    let newState = result.createState("q" + (stateIndex++));
    bStateMap.set(state, newState);
    if (firstBState === null) firstBState = newState;
    lastBState = newState;
  }

	const aTransitions = a.getTransitions();
	for (const transition of aTransitions)
	{
    const newFromState = aStateMap.get(transition.getSourceState());
    const newToState = aStateMap.get(transition.getDestinationState());
    if (newFromState === null || newToState === null) throw new Error("Unable to find state endpoints for transition");
    for(const symbol of transition.getSymbols())
    {
  		result.addTransition(newFromState, newToState, symbol);
    }
	}
  
  for(const finalState of a.getFinalStates())
  {
    const newFinalState = aStateMap.get(finalState);
    result.addTransition(newFinalState, firstBState, EMPTY_SYMBOL);
  }

	const bTransitions = b.getTransitions();
	for (const transition of bTransitions)
	{
    const newFromState = bStateMap.get(transition.getSourceState());
    const newToState = bStateMap.get(transition.getDestinationState());
    if (newFromState === null || newToState === null) throw new Error("Unable to find state endpoints for transition");
    for(const symbol of transition.getSymbols())
    {
  		result.addTransition(newFromState, newToState, symbol);
    }
	}

	result.setStartState(firstAState);
	result.setFinalState(lastBState);
	return result;
}

function kleene(a)
{
	const result = new FSA(false);
  let stateIndex = 0;

  const stateMap = new Map();

  const firstState = result.createState("q" + (stateIndex++));
  let firstAState = null;
  let lastAState = null;
  for(const state of a.getStates())
  {
    let newState = result.createState("q" + (stateIndex++));
    stateMap.set(state, newState);

    if (firstAState === null) firstAState = newState;
    lastAState = newState;
  }
  const lastState = result.createState("q" + (stateIndex++));

  result.addTransition(firstState, firstAState, EMPTY_SYMBOL);

  const aTransitions = a.getTransitions();
	for (const transition of aTransitions)
	{
    const newFromState = stateMap.get(transition.getSourceState());
    const newToState = stateMap.get(transition.getDestinationState());
    if (newFromState === null || newToState === null) throw new Error("Unable to find state endpoints for transition");
    for(const symbol of transition.getSymbols())
    {
  		result.addTransition(newFromState, newToState, symbol);
    }
	}

	result.addTransition(lastAState, lastState, EMPTY_SYMBOL);
	result.addTransition(lastAState, firstAState, EMPTY_SYMBOL);
	result.addTransition(firstState, lastState, EMPTY_SYMBOL);

	result.setStartState(firstState);
	result.setFinalState(lastState);
	return result;
}

function or(a, b)
{
	const result = new FSA(false);
  let stateIndex = 0;

  const firstState = result.createState("q" + (stateIndex++));

  let aStateMap = new Map();
  let firstAState = null;
  let lastAState = null;
  for(const state of a.getStates())
  {
    let newState = result.createState("q" + (stateIndex++));
    aStateMap.set(state, newState);
    if (firstAState === null) firstAState = newState;
    lastAState = newState;
  }

  let bStateMap = new Map();
  let firstBState = null;
  let lastBState = null;
  for(const state of b.getStates())
  {
    let newState = result.createState("q" + (stateIndex++));
    bStateMap.set(state, newState);
    if (firstBState === null) firstBState = newState;
    lastBState = newState;
  }

  const lastState = result.createState("q" + (stateIndex++));

  //A machine
	result.addTransition(firstState, firstAState, EMPTY_SYMBOL);
  const aTransitions = a.getTransitions();
	for (const transition of aTransitions)
	{
    const newFromState = aStateMap.get(transition.getSourceState());
    const newToState = aStateMap.get(transition.getDestinationState());
    if (newFromState === null || newToState === null) throw new Error("Unable to find state endpoints for transition");
    for(const symbol of transition.getSymbols())
    {
  		result.addTransition(newFromState, newToState, symbol);
    }
	}
	result.addTransition(lastAState, lastState, EMPTY_SYMBOL);

  //B machine
	result.addTransition(firstState, firstBState, EMPTY_SYMBOL);
  const bTransitions = b.getTransitions();
	for (const transition of bTransitions)
	{
    const newFromState = bStateMap.get(transition.getSourceState());
    const newToState = bStateMap.get(transition.getDestinationState());
    if (newFromState === null || newToState === null) throw new Error("Unable to find state endpoints for transition");
    for(const symbol of transition.getSymbols())
    {
  		result.addTransition(newFromState, newToState, symbol);
    }
	}
	result.addTransition(lastBState, lastState, EMPTY_SYMBOL);

	result.setStartState(firstState);
	result.setFinalState(lastState);
	return result;
}
