import PDA, {EMPTY_SYMBOL} from 'modules/pda/machine/PDA.js';
import { EMPTY } from 'modules/re/machine/RE.js';

/**
 * A function for converting a CFG into a PDA based on algorithm from the following video:
 * https://www.youtube.com/watch?v=xWWRoiPRAi4&t=748s 
 * @param {CFG} CFG to convert
 * @returns {PDA} PDA of CFG
 */
export function convertToPDA(cfg)
{
    //Check if CFG is valid
    if(!cfg.validate()) throw new Error('Trying to convert an invalid cfg to a pda');

    //Split rules by PIPE
    cfg.separateRulesBySubstitutions(true);

    const machine = new PDA();
    const state1 = machine.createState('q1');
    const state2 = machine.createState('q2');
    const state3 = machine.createState('q3');
    const state4 = machine.createState('q4');
    let lastStateNum = 4;

    //STEP 1: Push a dollar sign onto the stack to mark the bottom
    machine.addTransition(state1, state2, EMPTY_SYMBOL, EMPTY_SYMBOL, '$');

    //STEP 2: Push startVariable to the stack
    machine.addTransition(state2, state3, EMPTY_SYMBOL, EMPTY_SYMBOL, cfg.getStartVariable());

    //STEP 3: Qloop(state3). For each rule, replace the lhs variable with the rightmost symbol of the rule,
    //keep pushing the rest of the symbols from right to left and then loop back to Qloop
    for(const rule of cfg.getRules())
    {
        const lhs = rule.getLHS();
        const rhs = rule.getRHS();

        //***One symbol RHS doesn't require new states, just a self-loop to replace lhs symbol with rhs symbol***
        if(rhs.length == 1)
        {
            let symbol = prepareTransitionSymbol(rhs);
            machine.addTransition(state3, state3, EMPTY_SYMBOL, lhs, symbol);
            continue;
        }
        else
        {
            let i = rhs.length - 1;
            let newState = machine.createState(`q${++lastStateNum}`);
            let symbol = prepareTransitionSymbol(rhs.charAt(i));
            //Replace lhs variable with rightmost symbol
            machine.addTransition(state3, newState, EMPTY_SYMBOL, lhs, symbol);
            //Push symbols from right to left
            for( --i ; i > 0; i-- )
            {
                let prevState = newState;
                symbol = prepareTransitionSymbol(rhs.charAt(i));
                newState = machine.createState(`q${++lastStateNum}`);
                machine.addTransition(prevState, newState, EMPTY_SYMBOL, EMPTY_SYMBOL, symbol);
            }
            //For the first rhs symbol, loop back to Qloop
            let firstSymbol = prepareTransitionSymbol(rhs.charAt(0));
            machine.addTransition(newState, state3, EMPTY_SYMBOL, EMPTY_SYMBOL, firstSymbol);
        }
    }

    //STEP 4: Pop terminals in a self-loop with Qloop
    for(const terminal of cfg.getTerminals())
    {
        machine.addTransition(state3, state3, terminal, terminal, EMPTY_SYMBOL);
    }

    //STEP 5: Pop dollar sign to get to accept state
    machine.addTransition(state3, state4, EMPTY_SYMBOL, '$', EMPTY_SYMBOL);

    machine.setStartState(state1);
    machine.setFinalState(state4);

    return machine;
}

function prepareTransitionSymbol(symbol)
{
    if(symbol == EMPTY)
    {
        return EMPTY_SYMBOL;
    }
    else
    {
        return symbol;
    }
}
