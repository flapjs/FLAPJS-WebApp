// eslint-disable-next-line no-unused-vars
import CFG from '../CFG.js';
import {Rule} from '../CFG.js';
import { EMPTY } from 'modules/re/machine/RE.js';

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

    let variablesEliminated = newCFG._rules.reduce((acc, cur) => 
    {
        acc[cur.getLHS()] = false;
        return acc;
    }, {}); // to prevent working on eliminated variable again

    // loop through newCFG._Rules to remove epsilon rules
    for(let rule of newCFG._rules) 
    {
        if(rule.isEpsilon() && !variablesEliminated[rule.getLHS()]) 
        {
            let ruleRemoved = newCFG.removeRule(rule);

            // check if the LHS variable has this epsilon rule as it's only rule
            let hasOnlyEpsilon = true;
            for(let temp of newCFG._rules) 
            {
                if(!temp.getLHS().localeCompare(rule.getLHS()) &&
                    temp.getRHS().localeCompare(rule.getRHS()))
                {
                    hasOnlyEpsilon = false;
                }
            }

            for(let otherRule of ruleRemoved)             
            {
                // if LHS variable has this epsilon rule as it's only rule, 
                // just remove all occurence of rule's LHS in otherRule
                if(hasOnlyEpsilon)
                {
                    newCFG._rules.push(otherRule.getRHS().replace(new RegExp(rule.getLHS(), 'g'), ''));
                }
                else
                {
                    let addedRules = eliminateEpsilonVariable(otherRule, rule.getLHS(),
                        variablesEliminated[otherRule.getLHS()]);
                    newCFG._rules = newCFG._rules.concat(addedRules);
                }
            }
            variablesEliminated[rule.getLHS()] = true; // mark it as done
            // remove the LHS variable from the set of variables if it only has
            // this epsilpn rule
            if(hasOnlyEpsilon)
            {
                newCFG._variables = newCFG._variables.filter((cur) => 
                {
                    return cur.localeCompare(rule.getLHS());
                });
            }
        }
    }
    return newCFG;
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
 * @param {boolean} LHSeliminated true if the LHS of this rule had a 
 *                  rule LHS -> epsilon and it was already, this prevent
 *                  this process from adding LHS -> epsilon again. However,
 *                  if false, we will add LHS -> epsilon this rule is
 *                  LHS -> variable.
 * @return {Array} a new rule from which each occurrence of the
 *                 variable are eliminated, empty if this rule doesn't
 *                 contain variable.
 */
export function eliminateEpsilonVariable(rule, variable, LHSeliminated = false) 
{
    // When the rule is LHS -> variable
    if(!rule.getRHS().localeCompare(variable))
    {
        if(LHSeliminated) 
        {
            return [];
        }
        return [new Rule(rule.getLHS().slice(), EMPTY)];
    }

    let indices = rule.indicesOf(variable);
    let addedRules = [];
    if(indices.length) // not empty
    {
        // 2**indices.length because of the exponential explosion as explained
        // in function header and -1 because we don't want string of all 1's
        for(let i = 0; i < (2**indices.length - 1); i++)
        {
            // convert to binary, pad to indices.length(), each 
            // binary string encode a specific the occurrence of variable
            let iInBinary = i.toString(2).padStart(indices.length, '0'); 

            // work in the reverse order so we don't encounter index issue
            let tempNewRuleRHS = rule.getRHS().slice();
            for(let j = iInBinary.length - 1; j >= 0; j--)
            {
                if(iInBinary[j] === '0')
                {
                    tempNewRuleRHS = tempNewRuleRHS.slice(0, indices[j]) + 
                                  tempNewRuleRHS.slice(indices[j] + variable.length);
                }
            }
            addedRules.push(new Rule(rule.getLHS(), tempNewRuleRHS));
        }
    }
    return addedRules;
}

function eliminateUnitRules(cfg)
{
    return;
}

function cleanUp(cfg)
{
    return;
}