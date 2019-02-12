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
        let count = 0;
        let expression = this.getExpression();
		for (let i = 0; i < expression.length; i++) {
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
        let expression = this.getExpression();
		if (expression.length == 0)
			throw new Error("The expression must be nonempty.");
		if (!this.areParenthesisBalanced())
			throw new Error("The parentheses are unbalanced!");
        switch(expression.charAt(0)) {
            //Only '(' or a symbol can be the first character
            case ')':
            case UNION:
            case KLEENE:
            case CONCAT:
                throw new Error("Operators are poorly formatted.");
        }
        for (let i = 1; i < expression.length; i++) {
			let currChar = expression.charAt(i);
			let prevChar = expression.charAt(i - 1);
			switch (currChar) {
    			case UNION:
                case CONCAT:
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
        let result="";
        let expression = this.getExpression();
        for(let i=0; i < expression.length; i++){
            let currChar = expression.charAt(i);
            result += currChar;
            if( i + 1 < expression.length){
                let nextChar = expression.charAt(i + 1);
                if(currChar != '(' && currChar != UNION &&
                    nextChar != ')' && nextChar != UNION && nextChar != KLEENE){
                    result+=CONCAT;
                }
            }
        }
        this.setExpression(result);
    }

}

export default Regex;
