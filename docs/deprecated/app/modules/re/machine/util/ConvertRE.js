import FSA, { EMPTY_SYMBOL } from 'modules/fsa2/machine/FSA.js';
import
{
    EMPTY,
    CONCAT,
    UNION,
    KLEENE,
    SIGMA,
    EMPTY_SET,
    PLUS
} from '../RE.js';

import REParser from '../REParser.js';

// Return NFA representation of the input regular expression
// Construction of NFA is done using Thompson's algorithm
export function convertToNFA(re)
{
    const prevExpression = re.getExpression();
    re.setExpression(prevExpression.replace(/\s/g, ''));
    re.insertConcatSymbols();
    const parser = new REParser();
    parser.parseRegex(re);         //Create parse tree and add terminals to re's terminal set
    const nfa = ASTtoNFA(parser.rootNode, re);
    re.setExpression(prevExpression);
    return nfa;
}

function ASTtoNFA(astNode, re)
{
    //Base case, terminal nodes are characters in the alphabet OR
    //the EmptySet or Sigma
    if (astNode.isTerminal())
    {
        switch (astNode.getSymbol())
        {
        case EMPTY_SET:
            return emptySet();
        case SIGMA:
            return sigma(re);
        default:
            return character(astNode.getSymbol());
        }
    }
    switch (astNode.getSymbol())
    {
    case KLEENE:
        return kleene(ASTtoNFA(astNode._children[0], re));
    case PLUS:
        return plus(ASTtoNFA(astNode._children[0], re));
    case CONCAT:
        return concat(ASTtoNFA(astNode._children[0], re), ASTtoNFA(astNode._children[1], re));
    case UNION:
        return or(ASTtoNFA(astNode._children[0], re), ASTtoNFA(astNode._children[1], re));
    case '(':
        return ASTtoNFA(astNode._children[0], re);
    default:
        throw new Error('You\'ve got a weird node in the AST tree with symbol ' + astNode.getSymbol());
    }
}

// For the empty set, the NFA is a start state, with no final state, nor transitions.
function emptySet()
{
    const result = new FSA(false);
    const state0 = result.createState('q0');
    result.setStartState(state0);
    return result;
}

// For Sigma, the NFA is just the union of all the terminals in the regular expression
// e.g. if Sigma = {0, 1}, then as a regular expression it is just 0 U 1
function sigma(re)
{
    const terminals = re.getTerminals();
    const charNFAs = [];

    if (terminals.size == 0) 
    {
        return emptySet();
    }
    // Build NFAs for each terminal in the terminal set
    for (const terminal of terminals) 
    {
        charNFAs.push(character(terminal));
    }
    // Unionize them into one big union NFA to return
    while (charNFAs.length > 1)
    {
        charNFAs[0] = or(charNFAs[0], charNFAs[1]);     // Accumulate in the 0th index
        charNFAs.splice(1, 1);                          // Shift down from 1st index
    }
    return charNFAs[0];
}

// For a symbol of the alphabet, the NFA is two states, a start and a finish state,
// with the transition being the symbol.
function character(symbol)
{
    // Necessary for having empty in an FSA
    if (symbol == EMPTY) 
    {
        symbol = EMPTY_SYMBOL;
    }
    const result = new FSA(false);
    const state0 = result.createState('q0');
    const state1 = result.createState('q1');
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
    // let lastAState = null;
    for (const state of a.getStates())
    {
        let newState = result.createState('q' + (stateIndex++));
        aStateMap.set(state, newState);
        if (firstAState === null) firstAState = newState;
        // lastAState = newState;
    }

    let bStateMap = new Map();
    let firstBState = null;
    let lastBState = null;
    for (const state of b.getStates())
    {
        let newState = result.createState('q' + (stateIndex++));
        bStateMap.set(state, newState);
        if (firstBState === null) firstBState = newState;
        // lastBState should only be set to a final state (EMPTY_SET has none)
        if (b.isFinalState(state)) 
        {
            lastBState = newState;
        }
    }

    const aTransitions = a.getTransitions();
    for (const transition of aTransitions)
    {
        const newFromState = aStateMap.get(transition.getSourceState());
        const newToState = aStateMap.get(transition.getDestinationState());
        if (newFromState === null || newToState === null) throw new Error('Unable to find state endpoints for transition');
        for (const symbol of transition.getSymbols())
        {
            result.addTransition(newFromState, newToState, symbol);
        }
    }

    for (const finalState of a.getFinalStates())
    {
        const newFinalState = aStateMap.get(finalState);
        result.addTransition(newFinalState, firstBState, EMPTY_SYMBOL);
    }

    const bTransitions = b.getTransitions();
    for (const transition of bTransitions)
    {
        const newFromState = bStateMap.get(transition.getSourceState());
        const newToState = bStateMap.get(transition.getDestinationState());
        if (newFromState === null || newToState === null) throw new Error('Unable to find state endpoints for transition');
        for (const symbol of transition.getSymbols())
        {
            result.addTransition(newFromState, newToState, symbol);
        }
    }

    result.setStartState(firstAState);
    if (lastBState != null) result.setFinalState(lastBState);
    return result;
}

function kleene(a)
{
    const result = new FSA(false);
    let stateIndex = 0;

    const stateMap = new Map();

    const firstState = result.createState('q' + (stateIndex++));
    let firstAState = null;
    let lastAState = null;
    for (const state of a.getStates())
    {
        let newState = result.createState('q' + (stateIndex++));
        stateMap.set(state, newState);

        if (firstAState === null) firstAState = newState;
        lastAState = newState;
    }
    const lastState = result.createState('q' + (stateIndex++));

    result.addTransition(firstState, firstAState, EMPTY_SYMBOL);

    const aTransitions = a.getTransitions();
    for (const transition of aTransitions)
    {
        const newFromState = stateMap.get(transition.getSourceState());
        const newToState = stateMap.get(transition.getDestinationState());
        if (newFromState === null || newToState === null) throw new Error('Unable to find state endpoints for transition');
        for (const symbol of transition.getSymbols())
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

function plus(a)
{
    return concat(a, kleene(a));
}

function or(a, b)
{
    const result = new FSA(false);
    let stateIndex = 0;

    const firstState = result.createState('q' + (stateIndex++));

    let aStateMap = new Map();
    let firstAState = null;
    let lastAState = null;
    for (const state of a.getStates())
    {
        let newState = result.createState('q' + (stateIndex++));
        aStateMap.set(state, newState);
        if (firstAState === null) firstAState = newState;
        // lastAState should only be set to a final state (EMPTY_SET has none)
        if (a.isFinalState(state)) 
        {
            lastAState = newState;
        }
    }

    let bStateMap = new Map();
    let firstBState = null;
    let lastBState = null;
    for (const state of b.getStates())
    {
        let newState = result.createState('q' + (stateIndex++));
        bStateMap.set(state, newState);
        if (firstBState === null) firstBState = newState;
        // lastBState should only be set to a final state (EMPTY_SET has none)
        if (b.isFinalState(state)) 
        {
            lastBState = newState;
        }
    }

    const lastState = result.createState('q' + (stateIndex++));

    //A machine
    result.addTransition(firstState, firstAState, EMPTY_SYMBOL);
    const aTransitions = a.getTransitions();
    for (const transition of aTransitions)
    {
        const newFromState = aStateMap.get(transition.getSourceState());
        const newToState = aStateMap.get(transition.getDestinationState());
        if (newFromState === null || newToState === null) throw new Error('Unable to find state endpoints for transition');
        for (const symbol of transition.getSymbols())
        {
            result.addTransition(newFromState, newToState, symbol);
        }
    }
    if (lastAState != null) 
    {
        result.addTransition(lastAState, lastState, EMPTY_SYMBOL);
    }

    //B machine
    result.addTransition(firstState, firstBState, EMPTY_SYMBOL);
    const bTransitions = b.getTransitions();
    for (const transition of bTransitions)
    {
        const newFromState = bStateMap.get(transition.getSourceState());
        const newToState = bStateMap.get(transition.getDestinationState());
        if (newFromState === null || newToState === null) throw new Error('Unable to find state endpoints for transition');
        for (const symbol of transition.getSymbols())
        {
            result.addTransition(newFromState, newToState, symbol);
        }
    }
    if (lastBState != null) 
    {
        result.addTransition(lastBState, lastState, EMPTY_SYMBOL);
    }

    result.setStartState(firstState);
    result.setFinalState(lastState);
    return result;
}
