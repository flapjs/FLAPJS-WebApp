// eslint-disable-next-line no-unused-vars
import CFG from '../CFG.js';
import {Rule} from '../CFG.js';

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
export function convertCFGtoChomsky(cfg) 
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
    let newCFG = new CFG();
    newCFG.copyFromCFG(cfg);
    let seperatedCFG = newCFG.separateRulesBySubstitutions();
    let CFGwithNewStartVariable = newStartVariable(seperatedCFG);
    let CFGwithNoEpsilonRules = eliminateEpsilonRules(CFGwithNewStartVariable);
    let CFGwithNoUnitRules = eliminateUnitRules(CFGwithNoEpsilonRules);
    let ChomksyNormalForm = cleanUp(CFGwithNoUnitRules);    
    return ChomksyNormalForm;
}

/**
 * Step one in the conversion of a CFG to its Chomsky normal form. Set a 
 * new start variable so a start variable will never appear on RHS of a rule.
 * Note that this function does not change it's parameter, it creates a 
 * new copy in which changes are made.
 * @param {CFG} CFG the CFG to be processed.
 * @return {CFG} the CFG after setting a new start variable.
 */
export function newStartVariable(cfg) 
{
    // TODO: Notify user that they can't name start variable as 'S_New'
    let newCFG = new CFG();
    newCFG.copyFromCFG(cfg);

    newCFG.addRule(new Rule('S_New', cfg.getStartVariable()));
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
function eliminateEpsilonRules(cfg) 
{
    // copy construct a new CFG
    let newCFG = new CFG();
    newCFG.copyFromCFG(cfg);

    let rulesProcessed = newCFG._Rules.reduce((acc, cur) => {
        if (!acc[cur]) 
        {
            acc[cur] = false;
        }
        return acc;
    }, {}); // to prevent working on processed rules again

    // loop through newCFG._Rules to remove epsilon rules
    for(let rule of newCFG._Rules) 
    {
        if(rule.isEpsilon()) 
        {
            let ruleRemoved = newCFG.removeRule(rule);
            for(let otherRules of ruleRemoved)             
            {
                let indices = otherRules.indicesOf(rule.getLHS());
                if(indices.length) // not empty
                {
                    for(let i = 0; i < (2**indices.length); i++)
                    {
                        let iInBinary = i.toString(2)
                            .padStart(indices.length, '0'); 

                        // work in the reverse order so don't encounter index issue
                        let tempNewRule = otherRules.getRHS().slice();
                        for(let j = iInBinary.length - 1; j >= 0; j--)
                        {
                            if(iInBinary[j] === '0')
                            {
                               tempNewRule = tempNewRule.slice(0, indices) 
                            }
                            else
                            {

                            }
                        }
                    }
                }
            }
            rulesProcessed[rule] = true; // mark it as done
        }

        // TODO: do a clean up on the grammar: that is, to remove 
        // terminals from the set of terminals if it has no rules
        // anymore

    }
    return;
}


/**
 * Remove each occurrence of variable from rule. For example, if
 * the rule is A -> bAbAb, and we want to remove A, then we would
 * have three new rules, together with A -> bAbAb, i.e. we have:
 *             A -> bAbAb | bbb | bbAb | bAbb 
 * In general, if a variable occurred n times, then we would add
 * another (2^n-1) rules, not counting the rule we started with. 
 * @param {Rule} rule the rule from which the variable is removed
 * @param {String} variable the variable to remove
 * @return {Rule} a new rule from which each occurrence of the
 *                variable are eliminated 
 */
export function eliminateVariableWithIndices(rule, variable) 
{

}
function eliminateUnitRules(cfg)
{
    return;
}

function cleanUp(cfg)
{
    return;
}