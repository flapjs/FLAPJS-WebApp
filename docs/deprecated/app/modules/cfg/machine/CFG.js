import { stringHash } from 'util/MathHelper.js';
import { EMPTY } from 'modules/re/machine/RE.js';

export const PIPE = '|';

/**
 * A class that represents a rule in a Context Free Grammar
 */
export class Rule
{
    /**
     * Create a Rule with two strings to represent the
     * left and right hand size of a rule (lhs -> rhs)
     * @param {String} [lhs=''] Represents the Variable on the left hand side of a production rule
     * @param {String} [rhs=''] Represents the substitutions on the right hand side of production rules
     */
    constructor(lhs = '', rhs = '')
    {
        //Remove whitespace from within the strings
        this._lhs = lhs.replace(/\s/g,'');
        this._rhs = rhs.replace(/\s/g,'');
    }

    setLHS(x)
    {
        this._lhs = x.replace(/\s/g,'');
    }
    getLHS()
    {
        return this._lhs;
    }

    setRHS(x)
    {
        this._rhs = x.replace(/\s/g,'');
    }
    getRHS(x)
    {
        return this._rhs;
    }

    /**
     * A rule with multiple substitutions ( S -> a | b ) becomes multiple rules: S -> a , S -> b
     * @returns {Array} Array of rules
     */
    splitRHSByPipe()
    {
        const subRules = [];
        const subStrings = this._rhs.split(PIPE);
        for(const subString of subStrings)
        {
            subRules.push( new Rule(this._lhs, subString) );
        }
        return subRules;
    }

    toString()
    {
        return this._lhs + '->' + this._rhs;
    }

    getHashCode()
    {
        return stringHash(this._lhs + '->' + this._rhs);
    }
}

/**
 * A class that represents a Context Free Grammar, containing the 4-tuple that makes one up
 * such as starting variable, variables, terminals, and rules.
 */
class CFG
{
    /**
     * Create a CFG with 4-tuple (S, V, R, T) initialized
     * @param {Set} [variables=new Set()] Set of variables
     * @param {Set} [terminals=new Set()] Set of terminals
     * @param {Array} [rules=[]] List of rules/productions
     * @param {String} [startVariable] Start variable
     */
    constructor(variables = new Set(), terminals = new Set(), rules = [], startVariable = '')
    {
        this._variables = variables;
        this._terminals = terminals;
        this._rules = rules;
        this._startVariable = startVariable;
        this._errors = [];
    }

    /**
     * Removes all variables, terminals, rules, starting variable and errors of CFG
     */
    clear()
    {
        this.clearVariables();
        this.clearTerminals();
        this.clearRules();
        this._startVariable = '';
        this._errors.length = 0;
    }

    /**
     * Check if rules are valid
     * Check if there is a startVariable, if at least one rule has it on the LHS, and it is in the variables
     * Check that there is no intersection between terminals and variables
     * TODO Check if its a proper CFG(unreachable symbols, cycles, etc)????? Ehhhh?
     */
    validate()
    {
        //Reset errors
        this._errors.length = 0;
        //Check if rules are valid
        for(const rule of this.getRules())
        {
            if(!this.isRuleValid(rule))
            {
                this._errors.push(new Error(rule.toString() + ' is an invalid rule'));
            }
        }
        //Check if there is a startVariable, if at least one rule has it on the LHS, and it is in the variables
        if(!this.getStartVariable())
        {
            this._errors.push(new Error('No start variable'));
        }
        else
        {
            let startVariableOnLHS = false;
            for(const rule of this.getRules())
            {
                if(rule.getLHS() == this.getStartVariable())
                {
                    startVariableOnLHS = true;
                }
            }
            if(!startVariableOnLHS)
            {
                this._errors.push(new Error('No rule where startVariable is on the LHS'));
            }
        }
        if(!this.hasVariable(this.getStartVariable()))
        {
            this._errors.push(new Error('Start Variable isn\'t in the set of variables'));
        }

        //Check that there is no intersection between terminals and variables
        let intersection = new Set([...this.getVariables()].filter(x => this.getTerminals().has(x)));
        if(intersection.size > 0)
        {
            this._errors.push(new Error('The set of Terminals and Variables should be disjoint'));
        }

        //TODO Check if its a proper CFG(unreachable symbols, cycles, etc)????? Ehhhh?
        return this.isValid();
    }
    isValid()
    {
        return this._errors.length == 0;
    }
    getErrors()
    {
        return this._errors;
    }

    isRuleValid(rule)
    {
        //LHS is size 1 and is a variable
        let LHSvalid = rule.getLHS().length == 1 && this.hasVariable(rule.getLHS());

        //RHS contains terminals and variables within the CFG
        let RHSvalid = rule.getRHS().length > 0;
        for(let char of rule.getRHS())
        {
            if(char != PIPE && char != EMPTY)
            {
                RHSvalid = RHSvalid && (this.hasVariable(char) || this.hasTerminal(char));
            }
        }
        return LHSvalid && RHSvalid;
    }

    /**
     * Replace all rules with multiple substitutions, like S -> a | b,
     * into multiple rules with each substitution it's own rule: S -> a and S -> b
     */
    separateRulesBySubstitutions(changeCFG=false)
    {
        let splitRules = [];
        for(const rule of this.getRules())
        {
            splitRules = splitRules.concat(rule.splitRHSByPipe());
        }
        if(changeCFG)
        {
            this._rules = splitRules;
        }
        return splitRules;
    }

    /**
     * @param {Rule} rule   rule to insert into CFG.
     * rule can have a RHS with pipes to represent multiple substitutions
     *      e.g. S -> a | b
     * Also, every rule that is added, the LHS is added to varaibles, and for the RHS,
     * characters that aren't pipes, EMPTY, or Variables are added to Terminals
     *
     * NOTE, this means there is the potential to add intended Variables as Terminals if they
     * are on the rhs of a rule before they get their own rule where they are on the LHS, this
     * is why we will remove the LHS variable from terminals for every newly added rule
     */
    addRule(rule)
    {
        // LHS is made a variable and (possibly) removed from terminals
        this.addVariable(rule.getLHS());
        this._terminals.delete(rule.getLHS());

        // RHS characters that are not PIPE, EMPTY, and Variables become terminals
        for(let char of rule.getRHS())
        {
            if(char != PIPE && char != EMPTY && !this.hasVariable(char))
            {
                this.addTerminal(char);
            }
        }
        this._rules.push(rule);
    }
    hasRule(rule)
    {
        return this._rules.includes(rule);
    }
    getRules()
    {
        return this._rules;
    }
    clearRules()
    {
        this._rules.length = 0;
    }

    addVariable(x)
    {
        this._variables.add(x);
    }
    removeVariable(x)
    {
        this._variables.delete(x);
    }
    hasVariable(x)
    {
        return this._variables.has(x);
    }
    getVariables()
    {
        return this._variables;
    }
    clearVariables()
    {
        this._variables.clear();
    }

    addTerminal(x)
    {
        this._terminals.add(x);
    }
    removeTerminal(x)
    {
        this._variables.delete(x);
    }
    hasTerminal(x)
    {
        return this._terminals.has(x);
    }
    getTerminals()
    {
        return this._terminals;
    }
    clearTerminals()
    {
        this._terminals.clear();
    }

    setStartVariable(x)
    {
        this._startVariable = x;
    }
    getStartVariable()
    {
        return this._startVariable;
    }

    getHashCode()
    {
        let string = '';
        for(const variable of this.getVariables())
        {
            string += variable + ',';
        }
        string += '|';
        for(const terminal of this.getTerminals())
        {
            string += terminal + ',';
        }
        string += '|';
        for(const rule of this.getRules())
        {
            string += rule.toString() + ',';
        }
        string += '|';
        string += this.getStartVariable();
        string += '|';
        return stringHash(string);
    }
}

export default CFG;
