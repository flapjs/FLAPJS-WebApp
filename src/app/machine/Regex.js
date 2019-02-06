import { EMPTY , CONCAT , UNION , KLEENE } from './Symbols.js';

class Regex {
    constructor() {
        this._expression = "";
    }

    getExpression() {
        return this._expression;
    }

    setExpression(expression) {
        this._expression = expression;
    }

    areParenthesisBalanced() {
        count = 0;
        expression = getExpression();
		for (i = 0; i < expression.length; i++) {
			if (expression.charAt(i) == '(')
				count++;
			else if (expression.charAt(i) == ')')
				count--;
			if (count < 0)
				return false;
		}
		return count == 0;
    }

    isExpressionValid() {
        expression = getExpression();
		if (expression.length == 0)
			throw new Error("The expression must be nonempty.");
		if (!areParenthesesBalanced())
			throw new Error("The parentheses are unbalanced!");
        switch(expression.charAt(0)) {
            //Only '(' or a symbol can be the first character
            case ')':
            case UNION:
            case KLEENE:
            case CONCAT:
                throw new Error("Operators are poorly formatted.");
        }
        for (i = 1; i < expression.length; i++) {
			currChar = expression.charAt(i);
			prevChar = expression.charAt(i - 1);
			switch (currChar) {
    			case UNION:
                    // UNION can't be the last character
    				if (i == expression.length - 1)
    					throw new UnsupportedOperationException(
    							"Operators are poorly formatted.");
    			case ')':
    			case KLEENE:
                    // Must be preceded with a symbol 
    				if (prevChar == '(' || prevChar == UNION || prevChar == CONCAT)
    					throw new Error("Operators are poorly formatted.");
    				break;
    			case EMPTY:
    				if (prevChar != '(' && prevChar != UNION)
    					throw new Error("Epsilon must not cat with anything else.");
    				if (i == expression.length - 1)
    					break;
    				nextChar = string.charAt(i + 1);
    				if (nextChar != ')' && nextChar != UNION && nextChar != KLEENE)
    					throw new Error("Epsilon must not cat with anything else.");
    				break;
			}
		}
		return expression;
    }

    insertConcatSymbols(){
        result="";
        expression = getExpression();
        for(i=0; i < expression.length; i++){
            currChar = expression.charAt(i);
            result += currChar;
            if( i + 1 < expression.length){
                nextChar = expression.charAt(i + 1);
                if(currChar != '(' && currChar != UNION &&
                    nextChar != ')' && nextChar != UNION && nextChar != KLEENE){
                    result+=CONCAT;
                }
            }
        }
        return result;
    }

}

export default Regex;
