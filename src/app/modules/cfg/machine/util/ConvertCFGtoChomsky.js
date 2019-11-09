// eslint-disable-next-line no-unused-vars
import CFG from '../CFG.js';
import Rule from '../CFG.js';

/**
 * Convert a CFG into Chomksy normal form.
 * <p>
 * Chomsky normal form is especially useful in CFG related algorithms. A 
 * CFG is in Chomsky normal form if it satisfy the following criteria:
 * Every rule is of the form: 
 *          A -> BC
 *          A -> a
 * where B and C are any variables except the start variable, and a is any termial.
 * Furthermore, the only rule that has epsilon on RHS is S -> epsilon where S is
 * the start variable.
 * </p>
 * @param {CFG} CFG the context free grammar to convert.
 * @return {CFG} a CFG in Chomsky normal form that is equivalent to the parameter.
 */
export function convertCFGtoChomsky(CFG) 
{
    /**
    * We break down the conversion procedure into four steps:
    * 1. Create a new start variable
    * 2. Eliminate all the epsilon rules
    * 3. Eliminate all the unit rules
    * 4. Final clean up
    * 
    * We will build a method for each of the four steps.
    */
    let result = CFG.separateRulesBySubstitutions();
    result = newStartVariable(result);
    result = eliminateEpsilonRules(result);
    result = eliminateUnitRules(result);
    result = cleanUp(result);    
    return result;
}

/**
 * Step one in the conversion of a CFG to its Chomsky normal form. Set a 
 * new start variable so a start variable will never appear on RHS of a rule.
 * Note that this function does not change it's parameter, it creates a 
 * new copy in which changes are made.
 * @param {CFG} CFG the CFG to be processed.
 * @return {CFG} the CFG after setting a new start variable.
 */
function newStartVariable(CFG) 
{
    let newCFG = new CFG(CFG);
    newCFG.addRule(new Rule('S_New', CFG.getStartVariable()));
    newCFG.setStartVariable('S_New');
    return newCFG;
}

/**
 * Step two in the conversion of a CFG to its Chomsky normal form. This step
 * eliminate all the epsilon rules in the CFG, and add new Rules for every 
 * eliminated rules. This can potentially lead to exponential blow.
 * @param {CFG} CFG the CFG to be processed.
 * @return {CFG} An equivalent CFG free of any epsilon rules.
 */
function eliminateEpsilonRules(CFG) 
{
    return;
}

function eliminateUnitRules(CFG)
{
    return;
}

function cleanUp(CFG)
{
    return;
}