import NFA from 'machine/NFA.js';
import { EMPTY , CONCAT , UNION , KLEENE } from 'machine/Symbols.js';


const SRC = 0;
const SYMBOL = 1;
const DST = 2;


// Return NFA representation of the input regular expression
// Construction of NFA is done using Thompson's algorithm
export function reToNFA(regex) {
    operator_stack = [];    //Holds characters of operators in regex
    operands_stack = [];    //Holds intermediate NFAs for building with Thompson algorithm

	for(index = 0; index < regex.length; index++) {
		cur_sym = regex.charAt(index);
		if(cur_sym != '(' && cur_sym != ')' && cur_sym != KLEENE && cur_sym != UNION && cur_sym != CONCAT) {
            operands_stack.push(character(cur_sym))
		} else {
			if(cur_sym == KLEENE) {
				star_sym = operands_stack.pop();
				operands_stack.push(kleene(star_sym));
			} else if(cur_sym == CONCAT) {
				operator_stack.push(cur_sym);
			} else if(cur_sym == UNION) {
				operator_stack.push(cur_sym);
			} else if(cur_sym == '(') {
				operator_stack.push(cur_sym);
			} else {         // We at a ')'
				op_count = 0;
				op_sym = operator_stack[operator_stack.length - 1];
				if(op_sym == '(') continue;
				do {
					operator_stack.pop();
					op_count++;

                    selections = []; //For NFAs
    				if(op_sym == CONCAT) {
    					for(i = 0; i < op_count; i++) {
    						op2 = operands_stack.pop();
    						op1 = operands_stack.pop();
    						operands_stack.push(concat(op1, op2));
    					}
    				} else if(op_sym == UNION){
                        for(i = 0; i < op_count + 1; i++) {
                            selections[i] = new NFA();
                        }
    					tracker = op_count;
    					for(i = 0; i < op_count + 1; i++) {
    						selections[tracker] = operands_stack.pop();
    						tracker--;
    					}
    					operands_stack.push(or(selections, op_count + 1));
    				}
				} while(operator_stack[operator_stack.length - 1] != '(');
				operator_stack.pop();


			}
		}
	}

	return operands_stack[operands_stack.length - 1];
}

// For a symbol of the alphabet, the NFA is two states, a start and a finish state,
// with the transition being the symbol.
function character(symbol) {
    result = new NFA();
    result.newState(0);
    result.newState(1);
    result.newTransition(0, 1, symbol);
    result.setStartState(0);
    result.setFinalState(1);
    return result;
}

function concat(a, b) {
    result = new NFA();
    for(i = 0; i < a.getStates.length + b.getStates.length; i++) {
        result.newState(i);
    }

    a_trans = a.getTransitions();
    for(const transition of a_trans) {
        result.newTransition(transition[SRC], transition[DST], transition[SYMBOL]);
    }

    result.newTransition(a.getFinalStates[0], a.getStates().length, EMPTY);

    b_trans = b.getTransitions();
    for(const transition of a_trans) {
        offset = a.getStates.length;
        result.newTransition(transition[SRC] + offset, transition[DST] + offset, transition[SYMBOL]);
    }

    result.setStartState(0);
    result.setFinalState(result.getStates.length - 1);
    return result;
}

function kleene(a) {

    result = new NFA();
    for(i = 0; i < a.getStates.length + 2; i++) {
        result.newState(i);
    }

    result.newTransition(0, 1, EMPTY);

    for(const transition of a.getTransitions()) {
        result.newTransition(transition[SRC] + 1, transition[DST] + 1, transition[SYMBOL]);
    }

    a_last = a.getStates.length;

    result.newTransition(a_last, a_last + 1, EMPTY);
    result.newTransition(a_last, 1, EMPTY);
    result.newTransition(0, a_last + 1, EMPTY);

    result.setStartState(0);
    result.setFinalState(a_last + 1);
    return result;
}

function or(a, b) {

    result = new NFA();
    vertex_count = 0

    for(i = 0; i < a.getStates.length + b.getStates.length + 2; i++) {
        vertex_count++;
        result.newState(i);
    }

    offset_tracker = 1;

    selections = [a, b];
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
