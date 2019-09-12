import NFA from 'deprecated/machine/NFA.js';
import { EMPTY , CONCAT , UNION , KLEENE } from 'deprecated/machine/Symbols.js';


const SRC = 0;
const SYMBOL = 1;
const DST = 2;


// Return NFA representation of the input regular expression
// Construction of NFA is done using Thompson's algorithm
export function reToNFA(regex) {
    const parser = new RegexParser();
    parser.parseRegex(regex);
    return ASTtoNFA(parser.rootNode);
}

function ASTtoNFA(astNode) {
    //Base case, terminal nodes are characters in the alphabet
    if(astNode.isTerminal()) {
        return character(astNode.getSymbol());
    }
    switch(astNode.getSymbol()) {
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
function character(symbol) {
    const result = new NFA();
    result.newState(0);
    result.newState(1);
    result.newTransition(0, 1, symbol);
    result.setStartState(0);
    result.setFinalState(1);
    return result;
}

function concat(a, b) {
    const result = new NFA();
    for(let i = 0; i < a.getStates().length + b.getStates().length; i++) {
        result.newState(i);
    }

    const a_trans = a.getTransitions();
    for(const transition of a_trans) {
        result.newTransition(transition[SRC], transition[DST], transition[SYMBOL]);
    }

    result.newTransition(a.getFinalStates()[0], a.getStates().length, EMPTY);

    const b_trans = b.getTransitions();
    for(const transition of b_trans) {
        let offset = a.getStates().length;
        result.newTransition(transition[SRC] + offset, transition[DST] + offset, transition[SYMBOL]);
    }

    result.setStartState(0);
    result.setFinalState(result.getStates().length - 1);
    return result;
}

function kleene(a) {

    const result = new NFA();
    for(let i = 0; i < a.getStates().length + 2; i++) {
        result.newState(i);
    }

    result.newTransition(0, 1, EMPTY);

    for(const transition of a.getTransitions()) {
        result.newTransition(transition[SRC] + 1, transition[DST] + 1, transition[SYMBOL]);
    }

    const a_last = a.getStates().length;

    result.newTransition(a_last, a_last + 1, EMPTY);
    result.newTransition(a_last, 1, EMPTY);
    result.newTransition(0, a_last + 1, EMPTY);

    result.setStartState(0);
    result.setFinalState(a_last + 1);
    return result;
}

function or(a, b) {

    const result = new NFA();
    let vertex_count = 0

    for(let i = 0; i < a.getStates().length + b.getStates().length + 2; i++) {
        vertex_count++;
        result.newState(i);
    }

    let offset_tracker = 1;

    const selections = [a, b];
    for(const operand of selections) {
        result.newTransition(0, offset_tracker, EMPTY);
        for(const transition of operand.getTransitions()) {
            result.newTransition(transition[SRC] + offset_tracker, transition[DST] + offset_tracker, transition[SYMBOL]);
        }
        offset_tracker += operand.getStates().length;

        result.newTransition(offset_tracker - 1, vertex_count - 1, EMPTY);
    }

    result.setStartState(0);
    result.setFinalState(vertex_count - 1);
    return result;
}
