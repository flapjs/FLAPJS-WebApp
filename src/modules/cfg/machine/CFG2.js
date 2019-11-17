import { stringHash } from '@flapjs/util/MathHelper.js';
import { EMPTY } from '@flapjs/modules/re/machine/RE.js';
//import { getConsoleOutput } from '@jest/console';

export const PIPE = '|';

/**
 * A class that represents a rule in a Context Free Grammar.
 */
export class Rule
{
    /**
     * Create a Rule with two strings to represent the
     * left and right hand size of a rule (lhs -> rhs).
     *
     * @param {string} [lhs=''] Represents the Variable on the left hand side of a production rule.
     * @param {string} [rhs=''] Represents the substitutions on the right hand side of production rules.
     */
    constructor(lhs = '', rhs = '')
    {
        //Remove whitespace from within the strings
        this._lhs = lhs.replace(/\s/g, '');
        this._rhs = rhs.replace(/\s/g, '');
    }

    /**
     * Create a deep copy of the calling Rule.
     *
     * @param {Rule} other The Rule to copy from.
     * @returns {Rule} A new object equivalent to the calling Rule.
     */
    copyFromRule({ _lhs: lhs, _rhs: rhs }) 
    {
        this._lhs = lhs;
        this._rhs = rhs;
    }

    setLHS(x)
    {
        this._lhs = x.replace(/\s/g, '');
    }
    getLHS()
    {
        return this._lhs;
    }

    setRHS(x)
    {
        this._rhs = x.replace(/\s/g, '');
    }
    getRHS(x)
    {
        return this._rhs;
    }

    /**
     * A rule with multiple substitutions ( S -> a | b ) becomes multiple rules: S -> a , S -> b.
     *
     * @returns {Array} Array of rules.
     */
    splitRHSByPipe()
    {
        const subRules = [];
        const subStrings = this._rhs.split(PIPE);
        for (const subString of subStrings)
        {
            subRules.push(new Rule(this._lhs, subString));
        }
        return subRules;
    }

    // Note: Please do not modify toString() to return String object, will crash
    // convertCFGtoChomsky module
    toString()
    {
        return this._lhs + '->' + this._rhs;
    }

    getHashCode()
    {
        return stringHash(this._lhs + '->' + this._rhs);
    }

    /**
     * Compare if the calling object and another Rule are equal, two rules are equal 
     * if and only if there LHF are equal and RHS are equal. 
     * @param {Rule} other The other rule to be compared.
     * 
     * @returns {boolean} true if two Rules are equal, false otherwise.
     */
    isEqual(other) 
    {
        return (!this._lhs.localeCompare(other._lhs)) &&
            (!this._rhs.localeCompare(other._rhs));
    }

    /**
     * Check if this rule is a epsilon rule, which means the RHS of the rule is 
     * empty string.
     *
     * @returns {boolean} True if the rule is an epsilon rule and false otherwise.
     */
    isEpsilon() 
    {
        return (this._rhs === EMPTY);
    }

    /**
     * Find all occurence  
     * @param {String} symbol the symbol to check.
     * @return {Arary} An Arrray of indices of the occurrence of the given symbol,
     *                 if the symbol doesn't occur in the Rule, Array is empty.
     * TODO: possible issue, miscounted A_12 as an occurence of A_1, must find other
     * ways to solve this such as using a delimiter. For now I will assume all the 
     * symbols are of the form [a-Z][0-9]*
     */
    indicesOf(symbol)
    {
        let string = this._rhs;
        let indices = [];
        for (let index = string.indexOf(symbol); index !== -1;)
        {
            // this prevents the next if statement from indexOutOfBounds error
            if ((index + symbol.length) === this._rhs.length) 
            {
                indices.push(string.length - symbol.length);
                break;
            }
            // if the character immediately after this symbol is a number, I will
            // assume this string is another symbol whose prefix is 'symbol'
            if (isNaN(string[index + symbol.length])) 
            {
                indices.push(index);
                // then record this index, and modify string
            }
            // look for the next occurrence anyway
            index = string.indexOf(symbol, index + symbol.length);
        }
        return indices;
    }
}

/**
 * A class that represents a Context Free Grammar, containing the 4-tuple that makes one up
 * such as starting variable, variables, terminals, and rules.
 */
class CFG
{
    /**
     * Create a CFG with 4-tuple (S, V, R, T) initialized.
     *
     * @param {Set} [variables=new Set()] Set of variables.
     * @param {Set} [terminals=new Set()] Set of terminals.
     * @param {Array} [rules=[]] List of rules/productions.
     * @param {string} [startVariable] Start variable.
     */
    constructor(variables = [], terminals = [], rules = [], startVariable = null)
    {
        this._variables = new Set(variables);
        this._terminals = new Set(terminals);
        this._rules = new Map();
        this._startVariable = startVariable;

        for(const rule of rules)
        {
            this._rules.set(rule.getLHS(), rule);
        }

        if (!this._variables.has(startVariable))
        {
            throw new Error('Start variable must be in the variable set.');
        }
    }

    /**
     * Create a CFG from another CFG, this is a deep copy.
     *
     * @param {CFG} another The CFG to copy from.
     */
    copyFromCFG({ _variables: variables, _terminals: terminals, _rules: rules,
        _startVariable: startVariable, _errors: errors }) 
    {
        this._variables = new Set(variables);
        this._terminals = new Set(terminals);
        this._rules = [];
        for (let rule of rules) 
        {
            let newRule = new Rule();
            newRule.copyFromRule(rule);
            this._rules.push(newRule);
        }
        this._startVariable = startVariable;
        this._errors = [];
        for (let error of errors) 
        {
            this._errors.push(new Error(error.message));
        }
    }

    /**
     * Removes all variables, terminals, rules, starting variable and errors of CFG.
     */
    clear()
    {
        this.clearVariables();
        this.clearTerminals();
        this.clearRules();
        this._startVariable = null;
        this._errors.length = 0;
    }

    /**
     * Clean up the CFG, including removing duplicate rules, removing variables that has
     * no rules anymore, and terminals that doesn't appear in any rule anymore. Also,
     * if the grammar is empty, clear() it.
     */
    cleanUp()
    {
        // grammar empty
        if (!this._rules.length) 
        {
            this.clear();
        }

        // to remove duplicate rules, we make use of the toString method and Set data Structure.
        let rule = this._rules.map((cur) => 
        {
            return cur.toString();
        });
        rule = new Set(rule);
        rule = Array.from(rule); // convert back to array
        this._rules = rule.map((cur) => 
        {
            let temp = cur.split('->');
            // if the RHS is '', we make it EMPTY
            if (!temp[1].length)
            {
                temp[1] = EMPTY;
            }
            return new Rule(temp[0], temp[1]);
        });

        // remove variables that doesn't have any production rules, i.e. only keep LHS of all rules
        let variables = rule.map((cur) => 
        {
            return cur.split('->')[0];
        });
        this._variables = new Set(variables);

        // TODO: remove any lingering terminals, hard to do at this point because it is not clear how 
        // to idenitify a terminal
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
        for (const rule of this.getRules())
        {
            if (!this.isRuleValid(rule))
            {
                this._errors.push(new Error(rule.toString() + ' is an invalid rule'));
            }
        }
        //Check if there is a startVariable, if at least one rule has it on the LHS, and it is in the variables
        if (!this.getStartVariable())
        {
            this._errors.push(new Error('No start variable'));
        }
        else
        {
            let startVariableOnLHS = false;
            for (const rule of this.getRules())
            {
                if (rule.getLHS() == this.getStartVariable())
                {
                    startVariableOnLHS = true;
                }
            }
            if (!startVariableOnLHS)
            {
                this._errors.push(new Error('No rule where startVariable is on the LHS'));
            }
        }
        if (!this.hasVariable(this.getStartVariable()))
        {
            this._errors.push(new Error('Start Variable isn\'t in the set of variables'));
        }

        //Check that there is no intersection between terminals and variables
        let intersection = new Set([...this.getVariables()].filter(x => this.getTerminals().has(x)));
        if (intersection.size > 0)
        {
            this._errors.push(new Error('The set of Terminals and Variables should be disjoint'));
        }

        //TODO Check if its a proper CFG(unreachable symbols, cycles, etc)????? Ehhhh?
        return this.isValid();
    }

    /**
     * TODO: Check if this CFG is a valid CFG, current version only returns if the CFG is error free.
     *
     * @returns {boolean} True if the CFG is valid, false otherwise.
     */
    isValid()
    {
        return this._errors.length == 0;
    }

    /**
     * Return the errors the current CFG has, in the form of an array.
     *
     * @returns {Array} The errors of the current CFG.
     */
    getErrors()
    {
        return this._errors;
    }

    /**
     * Check if a Rule is valid. A rule is valid if it has only one variable on the LHS, and 
     * the RHS contains rules and variables within the CFG. 
     * @param {Rule} rule The Rule to check.
     */
    isRuleValid(rule)
    {
        //LHS is size 1 and is a variable
        let LHSvalid = rule.getLHS().length == 1 && this.hasVariable(rule.getLHS());

        //RHS contains terminals and variables within the CFG
        let RHSvalid = rule.getRHS().length > 0;
        for (let char of rule.getRHS())
        {
            if (char != PIPE && char != EMPTY)
            {
                RHSvalid = RHSvalid && (this.hasVariable(char) || this.hasTerminal(char));
            }
        }
        return LHSvalid && RHSvalid;
    }

    /**
     * Replace all rules with multiple substitutions, like S -> a | b,
     * into multiple rules with each substitution it's own rule: S -> a and S -> b.
     *
     * @param {boolean} changeCFG If set to true will modify the parameter CFG itself.
     */
    separateRulesBySubstitutions(changeCFG = false)
    {
        let splitRules = [];
        for (const rule of this.getRules())
        {
            splitRules = splitRules.concat(rule.splitRHSByPipe());
        }
        if (changeCFG)
        {
            this._rules = splitRules;
        }
        return splitRules;
    }

    /**
     * Rule can have a RHS with pipes to represent multiple substitutions
     *      e.g. S -> a | b
     * Also, every rule that is added, the LHS is added to varaibles, and for the RHS,
     * characters that aren't pipes, EMPTY, or Variables are added to Terminals.
     *
     * NOTE, this means there is the potential to add intended Variables as Terminals if they
     * are on the RHS of a rule before they get their own rule where they are on the LHS, this
     * is why we will remove the LHS variable from terminals for every newly added rule
     *
     * @param {Rule} rule  rule to insert into CFG.
     */
    addRule(rule)
    {
        // LHS is made a variable and (possibly) removed from terminals
        this.addVariable(rule.getLHS());
        this._terminals.delete(rule.getLHS());

        // RHS characters that are not PIPE, EMPTY, and Variables become terminals
        for (let char of rule.getRHS())
        {
            if (char != PIPE && char != EMPTY && !this.hasVariable(char))
            {
                this.addTerminal(char);
            }
        }
        this._rules.push(rule);
    }

    /**
     * Remove a certain rule from our grammar.
     *
     * @param {Rule} rule The rule to remove.
     */
    removeRule(rule) 
    {
        // use a filter function to filter out the rule
        this._rules = this._rules.filter((cur) => 
        {
            return !cur.isEqual(rule);
        });
    }

    /**
     * Try to find an epsilon rule in the grammar, or return null if none 
     * found.
     *
     * @returns {Rule} An epsilon rule in the grammar, or null if none found.
     */
    findEpsilonRule()
    {
        for (let rule of this._rules) 
        {
            if (rule.isEpsilon())
            {
                return rule;
            }
        }
        return null;
    }

    /**
     * Try to find an unit rule in the grammar, or return null if none 
     * found.
     *
     * @returns {Rule} An unit rule in the grammar, or null if none found.
     */
    findUnitRule()
    {
        for (let rule of this._rules) 
        {
            if (this.getVariables().has(rule.getRHS()))
            {
                return rule;
            }
        }
        return null;
    }

    /**
     * Check if the CFG contains a certain rule. 
     * 
     * @param {Rule} rule True if the rule is in the CFG, false otherwise.
     * @returns {boolean} Whether it has the rule.
     */
    hasRule(rule)
    {
        // do a deep comparison, looping this._rules and call isEqual
        for (let existingRule of this._rules) 
        {
            if (existingRule.isEqual(rule)) 
            {
                return true;
            }
        }
        return false;
    }

    /**
     * Get the set of Rules of this CFG.
     *
     * @returns {Array} The set of Rules of this CFG. 
     */
    getRules()
    {
        return this._rules;
    }

    /**
     * Clear the set of Rules of this CFG.
     */
    clearRules()
    {
        this._rules.length = 0;
    }

    /**
     * Add a variable to the set of variables. 
     * @param {String} x the variable to add to the set of variables.
     */
    addVariable(x)
    {
        this._variables.add(x);
    }

    /**
     * Remove a variable from the set of variables.
     *
     * @param {string} x The variable to remove from the set of variables.
     */
    removeVariable(x)
    {
        this._variables.delete(x);
    }

    /**
     * Check if a variable exists in the set of variables.
     *
     * @param {string} x The variable to check.
     * @returns {boolean} True if the variable is in the grammar, false otherwise.
     */
    hasVariable(x)
    {
        return this._variables.has(x);
    }

    /**
     * Get the set of variables of this grammar.
     *
     * @returns {Set} The set of variables of this grammar.
     */
    getVariables()
    {
        return this._variables;
    }

    /**
     * Clear the set of variables of this grammar.
     */
    clearVariables()
    {
        this._variables.clear();
    }

    /**
     * Add a terminal to the set of terminals of this grammar.
     *
     * @param {string} x The terminal to add to the grammar.
     */
    addTerminal(x)
    {
        this._terminals.add(x);
    }

    /**
     * Remove a terminal from the set of terminals of this grammar.
     *
     * @param {string} x The terminal to remove from the grammar.
     */
    removeTerminal(x)
    {
        this._variables.delete(x);
    }

    /**
     * Check if a terminal is in the set of terminals of this grammar.
     *
     * @param {string} x The terminal to check for.
     * @returns {boolean} True if the terminal is in the grammar, false otherwise.
     */
    hasTerminal(x)
    {
        return this._terminals.has(x);
    }

    /**
     * Get the set of terminals of this grammar.
     *
     * @returns {Set} The set of terminals of this grammar.
     */
    getTerminals()
    {
        return this._terminals;
    }

    /**
     * Clear the set of terminals of this grammar.
     */
    clearTerminals()
    {
        this._terminals.clear();
    }

    /**
     * Set the start variable of the grammar.
     *
     * @param {string} x Set the start variable of the grammar.
     */
    setStartVariable(x)
    {
        this._startVariable = x;
    }

    /**
     * Get the start variable of the grammar.
     *
     * @returns {string} The start variable of the grammar.
     */
    getStartVariable()
    {
        return this._startVariable;
    }

    /**
     * Return the hash code specific to the current grammar. The hash code
     * is computed based on the four elements of a grammar.
     */
    getHashCode()
    {
        let string = '';
        for (const variable of this.getVariables())
        {
            string += variable + ',';
        }
        string += '|';
        for (const terminal of this.getTerminals())
        {
            string += terminal + ',';
        }
        string += '|';
        for (const rule of this.getRules())
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
