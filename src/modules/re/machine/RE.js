import { stringHash } from '@flapjs/util/MathHelper.js';

export const EMPTY = '\u03B5';
export const CONCAT = '\u25E6';
export const UNION = '\u222A';
export const KLEENE = '*';
export const SIGMA = '\u03A3';
export const EMPTY_SET = '\u2205';
export const PLUS = '\u207A';

class RE
{
    constructor(expression = '')
    {
        this._expression = expression;
        this._terminals = new Set();
        this._errors = [];
    }

    /**
     * Performs a shallow copy of the 2 machines. Any changes to a state will be
     * reflected in both. However, changes to transitions, alphabet, and final
     * states will not propagate.
     * 
     * @param {RE} re The re instance.
     */
    copy(re)
    {
        //You are already yourself, don't copy nothing.
        if (re === this) return;

        //Make room for the copy...
        this.clear();

        this._expression = re._expression;

        //Copy terminals
        for (const terminal of re._terminals)
        {
            this._terminals.add(terminal);
        }

        //Copy errors
        for (const error of re._errors)
        {
            //WARNING: if the error's store state objects, they need to be redirected to the copies
            this._errors.push(error);
        }
    }

    clear()
    {
        this._expression = '';
        this._terminals.clear();
        this._errors.length = 0;
    }

    validate()
    {
        //Reset errors
        this._errors.length = 0;

        try
        {
            if (this.isExpressionValid())
            {
                return true;
            }
        }
        catch (e)
        {
            this._errors.push(e);
        }

        return false;
    }
    isValid()
    {
        return this._errors.length == 0;
    }
    getErrors()
    {
        return this._errors;
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

    areParenthesisBalanced()
    {
        let count = 0;
        let expression = this.getExpression();
        for (let i = 0; i < expression.length; i++)
        {
            if (expression.charAt(i) == '(')
                count++;
            else if (expression.charAt(i) == ')')
                count--;
            if (count < 0)
                return false;
        }
        return count == 0;
    }

    isExpressionValid()
    {
        let expression = this.getExpression();
        if (!expression || expression.length == 0) return true;
        //throw new Error("The expression must be nonempty.");
        if (!this.areParenthesisBalanced())
            throw new Error('The parentheses are unbalanced!');
        switch (expression.charAt(0))
        {
        //Only '(' or a symbol can be the first character
            case ')':
            case UNION:
            case KLEENE:
            case CONCAT:
            case PLUS:
                throw new Error('Operators are poorly formatted.');
        }
        for (let i = 1; i < expression.length; i++)
        {
            let currChar = expression.charAt(i);
            let prevChar = expression.charAt(i - 1);
            switch (currChar)
            {
                case UNION:
                case CONCAT:
                // UNION and CONCAT can't be the last character
                    if (i == expression.length - 1)
                        throw new Error('Operators are poorly formatted.');
                    // eslint-disable-next-line no-fallthrough
                case ')':
                case KLEENE:
                case PLUS:
                // Must be preceded with a symbol
                    if (prevChar == '(' || prevChar == UNION || prevChar == CONCAT)
                        throw new Error('Operators are poorly formatted.');
                    // Kleene and Plus cannot be applied to empty set
                    if ((currChar == KLEENE || currChar == PLUS) && prevChar == EMPTY_SET)
                        throw new Error('Empty set can only be part of a union or concatenation');
                    break;
            }
        }
        return true;
    }

    insertConcatSymbols()
    {
        let result = '';
        let expression = this.getExpression();
        for (let i = 0; i < expression.length; i++)
        {
            let currChar = expression.charAt(i);
            result += currChar;
            if (i + 1 < expression.length)
            {
                let nextChar = expression.charAt(i + 1);
                if (currChar != '(' && currChar != UNION && currChar != CONCAT &&
					nextChar != ')' && nextChar != UNION && nextChar != KLEENE && nextChar != PLUS && nextChar != CONCAT)
                {
                    result += CONCAT;
                }
            }
        }
        this.setExpression(result);
    }


    setExpression(expression)
    {
        this._expression = expression;
        return this;
    }

    getExpression()
    {
        return this._expression;
    }

    getHashCode()
    {
        return stringHash(this._expression);
    }
}

export default RE;
