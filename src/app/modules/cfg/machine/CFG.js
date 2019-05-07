import GraphElement from 'graph/GraphElement.js';
import { guid, stringHash } from 'util/MathHelper.js';
import { EMPTY } from 'modules/re/machine/RE.js';

export const PIPE = "|";

class Rule
{
    //lhs -> rhs
    constructor(lhs = "", rhs = "")
    {
        //Remove whitespace from within the strings
        this._lhs = lhs.replace(/\s/g,'');
        this._rhs = rhs.replace(/\s/g,'');
    }

    setLHS(x)
    {
        this._lhs = x;
    }
    getLHS()
    {
        return this._lhs;
    }

    setRHS(x)
    {
        this._rhs = x;
    }
    getRHS(x)
    {
        return this._rhs;
    }

    // A rule with multiple substitutions, S -> a | b becomes multiple rules: S -> a , S -> b
    splitRHSByPipe()
    {
        const subRules = []
        const subStrings = this._rhs.split(PIPE);
        for(const subString of subStrings)
        {
            subRules.push( new Rule(this._lhs, subString) );
        }
        return subRules;
    }

    toString()
    {
        return this._lhs + "->" + this._rhs;
    }

    getHashCode()
    {
        return stringHash(this._lhs + "->" + this._rhs);
    }
}

class CFG
{
    constructor(variables = new Set(), terminals = new Set(), rules = [], startVariable = "")
    {
        this._variables = variables;
        this._terminals = terminals;
        this._rules = rules;
        this._startVariable = startVariable;
        this._errors = [];
    }

    clear()
    {
        this.clearVariables();
        this.clearTerminals();
        this.clearRules();
        this._startVariable = "";
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
                this._errors.push(new Error(rule.toString() + " is an invalid rule"));
            }
        }
        //Check if there is a startVariable, if at least one rule has it on the LHS, and it is in the variables
        if(!this.getStartVariable())
        {
            this._errors.push(new Error("No start variable"));
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
                this._errors.push(new Error("No rule where startVariable is on the LHS"));
            }
        }
        if(!this.hasVariable(this.getStartVariable()))
        {
            this._errors.push(new Error("Start Variable isn't in the set of variables"));
        }

        //Check that there is no intersection between terminals and variables
        let intersection = new Set([...this.getVariables()].filter(x => this.getTerminals.has(x)));
        if(intersection.size > 0)
        {
            this._errors.push(new Error("A Terminal should not be a Variable too, or vice versa"))
        }

        //TODO Check if its a proper CFG(unreachable symbols, cycles, etc)????? Ehhhh?
        return isValid();
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
        let LHSvalid = rule.getLHS().length == 1 && this.hasVariable(rule.getLHS())
        //RHS contains terminals and variables within the CFG
        let RHSvalid = true;
        for(let char of rule.getRHS())
        {
            if(char != PIPE && char != EMPTY)
            {
                if(char == char.toUpperCase())
                {
                    RHSvalid = RHSvalid && this.hasVariable(char);
                }
                else
                {
                    RHSvalid = RHSvalid && this.hasTerminal(char);
                }
            }
        }
        return LHSvalid && RHSvalid;
    }

    /**
     * Replace all rules with multiple substitutions, like S -> a | b,
     * into multiple rules with each substitution it's own rule: S -> a and S -> b
     */
    separateRulesBySubstitutions()
    {
        const splitRules = [];
        for(const rule of this.getRules())
        {
            splitRules.push(rule.splitRHSByPipe());
        }
        return splitRules;
    }

    /**
     * @param {Rule} rule   rule to insert into CFG.
     * rule can have a RHS with pipes to represent multiple substitutions
     *      e.g. S -> a | b
     * Also, every rule that is added, the LHS is added to terminals, and for the RHS,
     * the uppercase characters are added to terminals, other characters (excluding EMPTY) are added to variables
     */
    addRule(rule)
    {
        this.addVariable(rule.getLHS());
        for(let char of rule.getRHS())
        {
            if(char != PIPE && char != EMPTY)
            {
                if(char == char.toUpperCase())
                {
                    this.addVariable(char);
                }
                else
                {
                    this.addTerminal(char);
                }
            }
        }
        this.rules.push(rule);
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
    getStartVariable(x)
    {
        return this._startVariable;
    }

    getHashCode()
    {
        //TODO
    }
}

export default CFG;
